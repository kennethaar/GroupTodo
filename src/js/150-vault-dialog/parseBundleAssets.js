function parseBundleAssets(text) {
  const out = new Map();
  const re = /<!--\s*gtd:asset\s+(assets\/\S+)\s+(\S+)\s*-->\n([\s\S]*?)\n?<!--\s*gtd:endasset\s*-->/g;
  let m;
  while ((m = re.exec(String(text)))) out.set(m[1], {type: m[2], b64: m[3].replace(/\s+/g, "")});
  return out;
}
