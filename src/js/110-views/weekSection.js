/* The week page per area, then the days. */
function weekSection(id) {
  const spaces = visibleSpaces().filter(n => LOADED.has(n));
  return el("div", {class: "weeksec"},
    journalWidths(el("div", {class: "jgrid"}, ...spaces.map(sp => el("section", {class: "jcard wkcard"},
      spaces.length > 1 ? el("header", {class: "jhead"}, spaceBadge(sp)) : null,
      weekColumn(sp, id)))), spaces),
    weekGrid(id));
}
