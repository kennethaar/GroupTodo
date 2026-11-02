/* Shared from another app: the service worker caught the POST and left the
   file in a one-item mailbox for us. */
async function collectSharedFile() {
  if (!CAP.served || !("caches" in window)) return;
  if (!/[?&]shared=1/.test(location.search)) return;
  try {
    const c = await caches.open("grouptodo-inbox");
    const r = await c.match("./shared-vault.md");
    if (r) {
      await mergeIncomingText(await r.text(), "The file you shared");
      await c.delete("./shared-vault.md");
    }
  } catch (_) {}
  try { history.replaceState(null, "", location.pathname); } catch (_) {}
}
