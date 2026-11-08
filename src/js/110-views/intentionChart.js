/* Every intention's running score on one chart, a line each (#210), drawn by
   the trackers' own chart. The last twelve weeks with a reflection. */
function intentionChart(aims, sc) {
  const weeks = sc.weeks.slice(-12), colours = Object.keys(TRACKER_COLOURS);
  const series = aims.map((a, i) => {
    const net = sc.net.get(a.id) || new Map();
    let run = sc.weeks.filter(w => w < weeks[0]).reduce((n, w) => n + (net.get(w) || 0), 0);
    return {name: a.title, label: a.title, icon: "", colour: colours[i % colours.length],
      by: new Map(weeks.map(w => [w, {v: run += net.get(w) || 0, e: {path: journalPath(w)}}]))};
  });
  return trackerDaysChart(series, weeks, "line", "number", e => openPage(e.path), true);
}
