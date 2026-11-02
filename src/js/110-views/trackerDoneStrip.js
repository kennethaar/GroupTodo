/* Done-or-not reads better as a row of days than as a line between 0 and 1. */
function trackerDoneStrip(points, openDay) {
  const strip = el("div", {class: "trkstrip"});
  for (const p of points.slice(-60)) strip.append(el("button", {class: "tday" + (p.v ? " on" : ""),
    title: humanDate(p.date) + (p.v ? ": done" : ": not done"), onclick: () => openDay(p.e)}));
  return strip;
}
