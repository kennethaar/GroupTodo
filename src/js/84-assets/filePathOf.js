function filePathOf(raw) {
  let p = String(raw).replace(/^file:/i, "");
  try { p = decodeURIComponent(p); } catch (_) {}
  p = p.replace(/\\/g, "/");
  if (/^\/\/\/?[a-z]:/i.test(p)) return p.replace(/^\/+/, "").replace(/\//g, "\\");  // C:\Users\...
  if (/^\/\/[^/]/.test(p)) return p.replace(/\//g, "\\");                           // \\server\share
  return p.replace(/^\/\/(?=\/)/, "");                                              // /home/...
}
