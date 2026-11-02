/* ---------- making one ---------- */
async function bakeInviteHtml() {
  // Only possible where the app can read its own source: a served page can
  // fetch itself, a file:// page cannot.
  const r = await fetch(location.href, {cache: "no-store"});
  const src = await r.text();
  if (!/<title>/i.test(src)) throw new Error("could not read the app's own file");
  // The vault is full of <!-- gtd:file --> comments, and a bare "<" inside a
  // script element puts the HTML parser into its legacy comment state, which
  // silently swallows the rest of the document. Escaping every "<" (and the two
  // line separators JSON leaves raw) keeps the payload inert text.
  const json = JSON.stringify({cfg: inviteConfig(), vault: bundleMarkdown()})
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
  const payload = "\n<script type=\"application/x-gtd-invite\">" + json + "<\/script>\n";
  // Split, never written whole: a literal closing body tag in this very source
  // is itself the first match in the file we are editing, so writing one here
  // made the app inject its payload into the middle of its own script.
  const closeBody = "<\/" + "body>";
  const at = src.lastIndexOf(closeBody);
  if (at === -1) throw new Error("no closing body tag in the app file");
  return src.slice(0, at) + payload + src.slice(at);
}
