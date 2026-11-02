/* The charts it could join: those of other trackers of its letter. */
function trackerChartNames(name) {
  const g = trackerGroup(name), seen = new Map();
  if (!g || !SHARED_MEASURE[g.code || ""]) return [];
  for (const x of trackerList()) {
    const c = x.name !== name && x.code === g.code && trackerChartOf(x);
    if (c && !seen.has(c.toLowerCase())) seen.set(c.toLowerCase(), c);
  }
  return [...seen.values()].sort((a, b) => a.localeCompare(b));
}
