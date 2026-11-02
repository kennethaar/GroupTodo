/* How far each chore is from its next round, averaged: 100% all just done,
   0% all due or past it. */
function freshScore(rows) {
  const r = rows.map(freshnessOf).filter(Boolean).map(f => f.rounds);
  return r.length ? Math.round(r.reduce((s, x) => s + Math.max(0, 1 - x), 0) / r.length * 100) : null;
}
