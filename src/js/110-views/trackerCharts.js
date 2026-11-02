/* The cards on Trackers: one per tracker, and one per chart that two or more share. */
function trackerCharts(list) {
  const by = new Map(), out = [];
  for (const g of list) {
    const chart = trackerChartOf(g);
    if (!chart) { out.push({groups: [g]}); continue; }
    const k = chart.toLowerCase() + "\0" + g.code;
    if (!by.has(k)) { by.set(k, {name: chart, code: g.code, groups: []}); out.push(by.get(k)); }
    by.get(k).groups.push(g);
  }
  return out.map(c => c.groups.length > 1 ? c : {groups: c.groups});
}
