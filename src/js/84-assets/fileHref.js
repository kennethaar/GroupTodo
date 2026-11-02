// The same place written the one way every browser reads: forward slashes,
// spaces and the rest escaped once.
function fileHref(raw) {
  const p = filePathOf(raw).replace(/\\/g, "/");
  const url = /^[a-z]:/i.test(p) ? "file:///" + p : p.startsWith("//") ? "file:" + p : "file://" + p;
  return encodeURI(url).replace(/#/g, "%23").replace(/\?/g, "%3F");
}
