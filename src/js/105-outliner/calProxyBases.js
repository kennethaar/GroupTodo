function calProxyBases() {
  const out = [];
  if (/^https?:$/.test(location.protocol)) out.push(location.origin);
  for (const sp of Spaces.list) if (sp.kind === "http" && sp.server) out.push(String(sp.server).replace(/\/$/, ""));
  out.push("http://127.0.0.1:8777");
  return [...new Set(out)];
}
