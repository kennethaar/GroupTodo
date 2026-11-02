/* On a project's page: the time clocked on its todos, and whose it is. */
function projectClockSection(path) {
  const S = sheetById("clients");
  const rows = sheetEntries(S).filter(e => e.space === V.space && e.projectPath === path);
  if (!rows.length) return null;
  const monday = weekStartISO(todayISO());
  const sum = (from, to) => rows.filter(e => e.date >= from && e.date <= to).reduce((n, e) => n + e.value, 0);
  const total = rows.reduce((n, e) => n + e.value, 0);
  return section("Time on its todos", fmtSheet(S, total), el("div", {class: "reportsum"},
    "This week ", el("b", {}, fmtSheet(S, sum(monday, shiftISO(monday, 6)))),
    " · last week " + fmtSheet(S, sum(shiftISO(monday, -7), shiftISO(monday, -1))) + " · for " + [...new Set(rows.map(e => e.name))].join(", "),
    el("button", {class: "btn sm ghost", style: "margin-left:auto",
      onclick: () => S.nav({sheetWeek: monday})}, "Clients")));
}
