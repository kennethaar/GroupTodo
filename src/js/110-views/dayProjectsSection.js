/* On a day's page, over its Linked References: the projects with that day's
   date in their title or on a line that links them (#440). Each opens its
   project. Nothing when there are none. */
function dayProjectsSection(path) {
  const iso = isJournalPath(path) ? baseName(path) : "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const list = projectsOnDay(iso).sort((a, b) => pageTitle(a).localeCompare(pageTitle(b)));
  if (!list.length) return null;
  const space = V.space;
  return el("div", {class: "section quiet dayprojects"},
    el("h3", {}, "Projects on this day ", el("span", {class: "n"}, String(list.length))),
    el("ul", {class: "dayproj-list"}, ...list.map(p =>
      el("li", {}, el("button", {class: "textbtn", title: "Open " + pageTitle(p), onclick: () => openPageIn(space, p)}, pageTitle(p))))));
}
