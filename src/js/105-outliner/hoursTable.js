function hoursTable(monday, items, by) {
  const days = Array.from({length: 7}, (_, i) => shiftISO(monday, i));
  const keys = new Map();
  for (const e of items) {
    const k = hoursKey(e, by);
    if (!keys.has(k)) keys.set(k, new Map());
    const m = keys.get(k);
    m.set(e.date, (m.get(e.date) || 0) + timeLogMin(e));
  }
  const sumOf = m => [...m.values()].reduce((s, x) => s + x, 0);
  const rows = [...keys.entries()].sort((a, b) => sumOf(b[1]) - sumOf(a[1]) || a[0].localeCompare(b[0]));
  const today = todayISO();
  const head = el("tr", {}, el("th", {}, by === "project" ? "Project" : "Who"),
    ...days.map(d => el("th", {class: d === today ? "now" : ""},
      parseISO(d).toLocaleDateString(undefined, {weekday: "short"}), el("small", {}, String(parseISO(d).getDate())))),
    el("th", {}, "Total"));
  // A project's name goes back to the project, in whichever area it is.
  const nameCell = k => {
    const e = by === "project" && items.find(x => x.project === k);
    const path = e && inSpace(e.space, () => timeLogProjectPath(k));
    return path ? el("button", {class: "hlink", title: "Open the project", onclick: () => openPageIn(e.space, path)}, k) : k;
  };
  const body = rows.map(([k, m]) => el("tr", {}, el("td", {}, nameCell(k)),
    ...days.map(d => el("td", {class: d === today ? "now" : ""}, fmtHM(m.get(d) || 0))),
    el("td", {}, el("b", {}, fmtHM(sumOf(m))))));
  const foot = rows.length > 1 ? [el("tr", {class: "tot"}, el("td", {}, "All"),
    ...days.map(d => el("td", {class: d === today ? "now" : ""}, fmtHM(rows.reduce((s, [, m]) => s + (m.get(d) || 0), 0)))),
    el("td", {}, el("b", {}, fmtHM(items.reduce((s, e) => s + timeLogMin(e), 0)))))] : [];
  return el("div", {class: "htable-wrap"}, el("table", {class: "htable"}, el("thead", {}, head), el("tbody", {}, ...body, ...foot)));
}
