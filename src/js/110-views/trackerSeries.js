/* ---------- the view ---------- */
/* One value per day: a day with two lines of the same tracker sums what adds
   up and keeps the best of what does not. */
function trackerSeries(g, measure) {
  const agg = TRACKER_MEASURES[measure].agg;
  const by = new Map();
  for (const e of g.entries) {
    const v = trackerMeasures(e)[measure];
    if (v == null) continue;
    if (!by.has(e.date)) by.set(e.date, {date: e.date, vals: [], e});
    by.get(e.date).vals.push(v);
  }
  return [...by.values()].map(d => ({date: d.date, e: d.e,
    v: agg === "sum" ? d.vals.reduce((a, b) => a + b, 0)
      : agg === "avg" ? Math.round(d.vals.reduce((a, b) => a + b, 0) / d.vals.length * 10) / 10
      : Math.max(...d.vals)}));
}
