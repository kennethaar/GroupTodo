function setTrackerStyle(name, style) {
  if (!TRACKER_STYLES[style]) { notify("A style is " + Object.keys(TRACKER_STYLES).join(", ") + ".", "warn"); return; }
  for (const n of [name, ...trackerChartMates(name).map(g => g.name)]) setTrackerProp(n, "style", style);
}
