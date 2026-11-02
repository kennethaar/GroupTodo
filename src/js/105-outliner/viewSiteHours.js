function viewSiteHours() {
  const c = el("div", {});
  const key = state.hoursRange || "week", by = state.hoursBy || "person";
  const goHours = patch => go("projects", Object.assign({sub: "hours", hoursOf: "site", hoursRange: key, hoursBy: by}, patch));
  const win = hoursWindow();
  const rows = timeLogEntries().filter(e => e.date >= win.from && e.date <= win.to);
  const weeks = hoursWeeks(rows);
  const total = rows.reduce((s, e) => s + timeLogMin(e), 0);
  c.append(fbar(
    fselect("Period", key, HOURS_RANGES.map(([k, l]) => [k, l]), v => goHours({hoursRange: v})),
    el("span", {class: "gap"}),
    fselect("Group by", by, HOURS_GROUPS, v => goHours({hoursBy: v})),
    el("button", {class: "btn sm primary", onclick: () => openTimeForm(null, null)}, "Check in")));
  c.append(el("div", {class: "section"}, el("div", {class: "reportsum"},
    el("b", {}, fmtMinutes(total) || "0 h"), " on site, " + humanDate(win.from) + " to " + humanDate(win.to) +
      " · " + rows.length + " visit(s) · " + new Set(rows.map(e => e.who)).size + " person(s)",
    el("button", {class: "btn sm ghost", style: "margin-left:auto", onclick: () => copyHours(weeks, by)}, "Copy as text"))));
  /* Whoever has not been checked out, today's and any forgotten on an earlier day. */
  const here = timeLogEntries().filter(e => timeLogOpen(e.block)).reverse();
  if (here.length) c.append(section("Not checked out", here.length, pagedCard(here, timeLogRow)));
  if (!rows.length) c.append(section("Hours", 0, emptyCard(
    "No visits in this window. Type /in on any line when somebody arrives, and /out when they leave.")));
  for (const [monday, items] of weeks)
    c.append(section(weekLabel(monday), fmtMinutes(items.reduce((s, e) => s + timeLogMin(e), 0)),
      el("div", {class: "card"}, hoursTable(monday, items, by),
        el("details", {class: "hlist"}, el("summary", {}, items.length + " visit(s)"),
          pagedCard(items.slice().reverse(), timeLogRow)))));
  return c;
}
