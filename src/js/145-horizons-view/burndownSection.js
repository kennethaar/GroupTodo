function burndownSection(win, space) {
  const series = burndownSeries(win.from, win.to, space);
  if (!series.length) return null;
  const first = series[0].open, now = series[series.length - 1].open;
  const added = series.reduce((n, p) => n + p.added, 0);
  const done = series.reduce((n, p) => n + p.done, 0);
  if (!added && !done && !now) return null;
  const days = Math.max(1, series.length - 1);
  const net = (done - added) / days;                       // tasks a day the list shrinks by
  const pace = !now ? "Nothing open. "
    : net > 0.05 ? "At this pace the list is empty in about " + Math.ceil(now / net / 7) + " week" + (Math.ceil(now / net / 7) === 1 ? "" : "s") + ". "
    : net < -0.05 ? "More is arriving than leaving. "
    : "About as much is arriving as leaving. ";
  const table = el("table", {class: "burntable"},
    el("tr", {}, el("th", {}, "Day"), el("th", {}, "Open"), el("th", {}, "Added"), el("th", {}, "Finished")),
    ...series.filter((p, i) => p.added || p.done || i === 0 || i === series.length - 1).map(p =>
      el("tr", {}, el("td", {}, humanDate(p.day)), el("td", {}, String(p.open)),
        el("td", {}, String(p.added)), el("td", {}, String(p.done)))));
  return el("div", {class: "section"},
    el("h3", {}, "Burndown", el("span", {class: "n"}, String(now))),
    el("div", {class: "card burncard"},
      burndownChart(series),
      el("div", {class: "burnsum"},
        "Open tasks went from " + first + " to " + now + " (" + (now - first > 0 ? "+" : "") + (now - first) + "): " +
        added + " added, " + done + " finished. " + pace),
      el("details", {class: "burndetails"}, el("summary", {}, "As a table"), table)));
}
