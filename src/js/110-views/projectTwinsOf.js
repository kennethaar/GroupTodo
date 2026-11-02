function projectTwinsOf(all) {
  const not = twinNotSame();
  const up = all.map((_, i) => i);
  const find = i => up[i] === i ? i : (up[i] = find(up[i]));
  const why = new Map();
  for (let i = 0; i < all.length; i++)
    for (let j = i + 1; j < all.length; j++) {
      if (not.has(twinPairKey(all[i].title, all[j].title))) continue;
      const w = twinWhy(all[i].title, all[j].title);
      if (!w) continue;
      up[find(i)] = find(j);
      why.set(i, w); why.set(j, w);
    }
  const groups = new Map();
  all.forEach((r, i) => { if (!why.has(i)) return; const g = find(i); (groups.get(g) || groups.set(g, []).get(g)).push(r); });
  return [...groups.values()].filter(rows => rows.length > 1)
    .map(rows => ({rows, why: why.get(all.indexOf(rows[0]))}));
}
