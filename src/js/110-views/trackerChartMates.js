/* The others on its chart. */
function trackerChartMates(name) {
  const g = trackerGroup(name);
  if (!trackerChartOf(g)) return [];
  return trackerList().filter(x => x.name !== name && sameChart(x, g));
}
