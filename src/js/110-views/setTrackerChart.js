function setTrackerChart(name, chart) {
  chart = trim(chart || "");
  const g = trackerGroup(name);
  const same = chart && trackerList().find(x => x.name !== name && x.code === g?.code && trackerChartOf(x).toLowerCase() === chart.toLowerCase());
  setTrackerProp(name, "chart", same ? trackerChartOf(same) : chart);
  // Joining takes the chart's style; on its own, a stacked bar is only a bar.
  const mates = trackerChartMates(name);
  if (mates.length) setTrackerProp(name, "style", mates.map(x => trackerProp(x.name, "style")).find(Boolean) || "");
  else if (trackerProp(name, "style").toLowerCase() === "stacked-bar") setTrackerProp(name, "style", "");
}
