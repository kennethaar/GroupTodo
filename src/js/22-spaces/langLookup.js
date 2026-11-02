/* The translation of s with its surrounding spaces kept, or null. */
function langLookup(s) {
  // Spaces inside are as the catalog has them: one, wherever the source wrapped a line.
  const m = /^(\s*)([\s\S]*?)(\s*)$/.exec(s), core = m[2].replace(/\s+/g, " ");
  if (!core || core.length > 2000 || !/[A-Za-z]/.test(core)) return null;
  let t = LANG.dict.get(core);
  if (t == null) {
    for (const lead of [core.slice(0, 3), ""]) {
      for (const tp of LANG.tpl.get(lead) || []) {
        const hit = tp.re.exec(core);
        if (!hit) continue;
        if (!tp.to) return null;
        t = tp.to.replace(/\{(\d+)\}/g, (all, n) => { const i = tp.ids.indexOf(n); return i < 0 ? all : hit[i + 1]; });
        break;
      }
      if (t != null) break;
    }
  }
  if (t == null) {
    if (core.length < 200 && LANG.missed.size < 3000 && !LANG.known?.has(core)) LANG.missed.add(core);
    return null;
  }
  return m[1] + t + m[3];
}
