/* The weekly review's steps, one row each, one column per review: which steps
   get done and which keep getting skipped. */
function reviewTrackerCard(groups) {
  const dates = [...new Set(groups.flatMap(g => g.entries.map(e => e.date)))].sort().slice(-12);
  const words = new Map(reviewSteps().flatMap(g => g.steps).map(s => [reviewStepSlug(s.text), s.text]));
  const card = el("div", {class: "card trkcard"});
  card.append(el("div", {class: "trkhead"}, el("h4", {}, "Weekly review"),
    el("span", {class: "plain"}, dates.length + " review" + (dates.length === 1 ? "" : "s") + " · each step, done or skipped")));
  const grid = el("div", {class: "rvgrid", style: "grid-template-columns:minmax(120px,1fr) repeat(" + dates.length + ",18px) auto"});
  grid.append(el("span", {}), ...dates.map(d => el("span", {class: "rvdate", title: humanDate(d)}, d.slice(8))), el("span", {}));
  const order = [...words.keys()];
  const rows = groups.slice().sort((a, b) => ((order.indexOf(a.name) + 1) || 999) - ((order.indexOf(b.name) + 1) || 999));
  for (const g of rows) {
    const byDate = new Map(g.entries.map(e => [e.date, e]));
    const done = dates.filter(d => byDate.has(d) && trackerMeasures(byDate.get(d)).done).length;
    const seen = dates.filter(d => byDate.has(d)).length;
    grid.append(el("span", {class: "rvstep", title: words.get(g.name) || ""}, words.get(g.name) || trackerTitle(g.name.slice(REVIEW_TRACKER_PREFIX.length))));
    for (const d of dates) {
      const e = byDate.get(d);
      grid.append(e ? el("button", {class: "tday" + (trackerMeasures(e).done ? " on" : ""),
        title: humanDate(d) + (trackerMeasures(e).done ? ": done" : ": skipped"),
        onclick: () => openPageIn(e.space || V.space, e.path)}) : el("span", {}));
    }
    grid.append(el("span", {class: "plain"}, done + "/" + seen));
  }
  card.append(grid);
  return card;
}
