/* The chart it is on, as the Trackers view shows it. */
function trackerPreview(name) {
  const g = trackerGroup(name);
  if (!g) return section("Preview", null, el("p", {class: "hint"}, "Nothing written in it yet. Fill in the line on a day and it shows up here."));
  const chart = trackerCharts(trackerList()).find(c => c.groups.includes(g));
  return section("Preview", null, chart.name ? trackerChartCard(chart) : trackerCard(g));
}
