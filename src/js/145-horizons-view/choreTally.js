function choreTally(from, to) {
  const rows = acrossSpaces(() => {
    const out = [];
    for (const path of allPages(() => true)) for (const b of flattenBlocks(getPage(path).blocks)) {
      if (b.state !== "DONE" || !repeatOf(b)) continue;
      const day = closedOn(b), who = closedBy(b);
      if (who && day && day >= from && day <= to) out.push({who, pts: chorePoints(b.title)});
    }
    return out;
  });
  const by = new Map();
  for (const r of rows) {
    const key = [...by.keys()].find(n => samePerson(n, r.who)) || r.who;
    const t = by.get(key) || {pts: 0, n: 0};
    t.pts += r.pts; t.n++;
    by.set(key, t);
  }
  return [...by].sort(([, x], [, y]) => y.pts - x.pts || y.n - x.n);
}
