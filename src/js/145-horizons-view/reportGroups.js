/* Months read newest first, because that is the order a report is read in.
   The rest read biggest first: the customer you did most for is the headline. */
function reportGroups(rows, by) {
  const g = new Map();
  for (const r of rows) {
    const k = reportGroupKey(r, by);
    if (!g.has(k)) g.set(k, []);
    g.get(k).push(r);
  }
  const pairs = Array.from(g.entries());
  return by === "month"
    ? pairs.sort((a, b) => b[0].localeCompare(a[0]))
    : pairs.sort((a, b) => b[1].length - a[1].length || String(a[0]).localeCompare(String(b[0])));
}
