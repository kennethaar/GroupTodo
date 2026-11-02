function roomSummary(rows, inRoom) {
  const by = {due: [], soon: [], fresh: []};
  for (const a of rows) by[choreGroup(a)].push(a);
  const sized = by.due.filter(a => estMinutes(a.title));
  const stalest = [...rows].sort((x, y) => choreRounds(y) - choreRounds(x))[0] || null;
  const next = [...rows].sort((x, y) => (x.due || "9").localeCompare(y.due || "9") || choreRounds(y) - choreRounds(x))[0] || null;
  return {pct: freshScore(rows), by, n: rows.length, stalest, next, who: next ? turnFor(next) : null,
    mins: sized.reduce((t, a) => t + estMinutes(a.title), 0), sized: sized.length,
    last: choresDone().find(d => inRoom(d.ctx)) || null};
}
