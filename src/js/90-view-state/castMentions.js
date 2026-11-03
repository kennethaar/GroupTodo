/* Every cast name in a text, in the order they come: [{key, at}]. */
function castMentions(text) {
  const finder = memo("castFinder\u0000" + V.space, () => {
    const byName = new Map();
    for (const e of castEntries()) for (const n of e.names) if (!byName.has(n)) byName.set(n, e.key);
    const names = [...byName.keys()].sort((a, b) => b.length - a.length);
    return names.length ? {byName, re: new RegExp("(?<![\\p{L}\\p{N}])(" + names.map(planReEsc).join("|") + ")(?![\\p{L}\\p{N}])", "gu")} : null;
  });
  if (!finder) return [];
  const out = [];
  for (const m of String(text).matchAll(finder.re)) out.push({key: finder.byName.get(m[1]), at: m.index});
  return out;
}
