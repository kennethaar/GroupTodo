/* GroupToDo service worker.

   Two jobs, both so the app can be a no-install app rather than a download:

   1. Keep the shell. Once the page has been opened over http(s) the browser
      can open it again with no network at all -- no server running, plane
      mode, Termux reclaimed by Android. The vault is never cached: a stale
      page is fine, stale tasks are not.

   2. Receive shared files. Android lets an installed web app appear in the
      system share sheet (manifest share_target). The share arrives as a POST,
      which no static host would understand, so it is caught here, stashed,
      and handed to the page on the redirect that follows.

   Used by both grouptodo.html served from any static host and by serve.py, which
   serves this same file.
*/
const SHELL   = "grouptodo-shell-v3";
const INBOX   = "grouptodo-inbox";
const SHELL_FILES = ["./", "./grouptodo.html", "./manifest.webmanifest", "./icon.svg"];

self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const c = await caches.open(SHELL);
    // One missing file must not fail the whole install.
    await Promise.all(SHELL_FILES.map(f => c.add(f).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== SHELL && k !== INBOX).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

/* ---------- shared-in files ---------- */
/* Stash the shared file under a URL the page can fetch once, then get out of
   the way. Cache storage is used as the mailbox because it is the one store
   both a worker and a page can reach without a schema. */
async function takeDelivery(request) {
  try {
    const form = await request.formData();
    const file = form.get("vault") || form.get("file");
    if (file && typeof file.text === "function") {
      const c = await caches.open(INBOX);
      await c.put("./shared-vault.md", new Response(await file.text(), {
        headers: {"Content-Type": "text/markdown; charset=utf-8",
                  "X-GroupTodo-Name": (file.name || "shared.md").replace(/[^\w.\- ]+/g, "")},
      }));
      return Response.redirect("./?shared=1", 303);
    }
  } catch (_) { /* fall through: better to open the app than to show an error */ }
  return Response.redirect("./", 303);
}

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  const here = new URL("./", self.location).pathname;

  if (e.request.method === "POST" && url.pathname === here + "share-target")
    return e.respondWith(takeDelivery(e.request));

  if (e.request.method !== "GET") return;
  // The vault speaks to its own server; never come between them.
  if (url.pathname.indexOf("/api/") !== -1) return;
  if (url.origin !== self.location.origin) return;

  const isShell = e.request.mode === "navigate" ||
                  url.pathname === here ||
                  /\/(grouptodo\.html|index\.html|manifest\.webmanifest|icon\.svg|sw\.js)$/.test(url.pathname);
  if (!isShell) return;

  e.respondWith(shell(e));
});

/* Network first, so a newer grouptodo.html is picked up whenever a host answers
   -- but not at any price. A weak signal, a captive portal or a half-asleep
   server used to hold the start for as long as the browser would wait, tens of
   seconds, with a perfectly good copy right here. Now the network gets
   NETWORK_WAIT to deliver the whole file; after that the copy opens and the
   download carries on in the background, ready for the next start. */
const NETWORK_WAIT = 2500;

async function shell(e) {
  const net = fetch(e.request).then(async r => {
    if (r && r.ok) {
      // Read to the end before answering: headers in time and three megabytes
      // trickling after them is just as slow as no answer.
      const copy = r.clone();
      await r.clone().arrayBuffer();
      await caches.open(SHELL).then(c => c.put(e.request, copy)).catch(() => {});
    }
    return r;
  });
  e.waitUntil(net.then(() => {}, () => {}));       // let the update finish after we answer
  const slow = new Promise(res => setTimeout(res, NETWORK_WAIT, "slow"));
  const first = await Promise.race([net.catch(() => "down"), slow]);
  if (first !== "slow" && first !== "down") return first;
  const hit = (await caches.match(e.request, {ignoreSearch: true})) ||
              (await caches.match("./grouptodo.html", {ignoreSearch: true}));
  if (hit) return hit;
  if (first === "slow") { try { return await net; } catch (_) {} }   // nothing kept yet: wait it out
  return new Response("Offline and nothing cached yet.", {status: 503});
}
