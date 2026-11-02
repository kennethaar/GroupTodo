/* Under the clients' week: which projects the time went to. */
function clientProjects(w) {
  const by = new Map();
  for (const e of w.rows) {
    const k = e.name + "\0" + e.project;
    if (!by.has(k)) by.set(k, {name: e.name, project: e.project, path: e.projectPath, space: e.space, min: 0});
    by.get(k).min += e.value;
  }
  const rows = [...by.values()].filter(r => r.min).sort((a, b) => a.name.localeCompare(b.name) || b.min - a.min);
  if (!rows.length) return null;
  return section("Projects", rows.length, el("div", {class: "card"}, ...rows.map(r => el("button", {class: "reprow",
    onclick: () => openPageIn(r.space, r.path)},
    el("span", {class: "when"}, r.name), el("span", {class: "what"}, r.project),
    el("span", {class: "marks"}, el("span", {class: "chip"}, fmtSheet(sheetById("clients"), r.min)))))));
}
