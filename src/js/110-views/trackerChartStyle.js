function trackerChartStyle(names, shared) {
  for (const n of names) {
    const s = trackerProp(n, "style").toLowerCase();
    if (TRACKER_STYLES[s]) return !shared && s === "stacked-bar" ? "bar" : s;
  }
  return shared ? "stacked-bar" : "line";
}
