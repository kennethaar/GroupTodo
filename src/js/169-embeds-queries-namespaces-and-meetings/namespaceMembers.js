function namespaceMembers(path) {
  const me = nsPlace(path);
  if (!me) return null;
  const root = me.segs[0].toLowerCase();
  const out = [];
  for (const p of V.pages.keys()) {
    if (!p.startsWith(me.base + "/")) continue;
    const at = nsPlace(p);
    if (!at || at.base !== me.base || at.segs[0].toLowerCase() !== root) continue;
    out.push({path: p, segs: at.segs});
  }
  if (out.length < 2 || !out.some(x => x.segs.length > 1)) return null;
  return {root: me.segs[0], base: me.base, members: out};
}
