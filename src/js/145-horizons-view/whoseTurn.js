function whoseTurn(block) {
  const people = members().map(m => m.name);
  if (people.length < 2) return null;
  const key = choreKey(block.title), since = shiftISO(todayISO(), -120);
  const tally = new Map(people.map(n => [n, {n: 0, last: ""}]));
  for (const path of allPages(() => true)) {
    for (const b of flattenBlocks(getPage(path).blocks)) {
      if (b.state !== "DONE" || !repeatOf(b) || choreKey(b.title) !== key) continue;
      const who = closedBy(b), day = closedOn(b) || "";
      const t = who && [...tally.keys()].find(n => samePerson(n, who));
      if (!t) continue;
      const row = tally.get(t);
      if (day >= since) row.n++;
      if (day > row.last) row.last = day;
    }
  }
  return [...tally].sort(([, x], [, y]) => x.n - y.n || x.last.localeCompare(y.last))[0][0];
}
