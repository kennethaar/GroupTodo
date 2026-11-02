function sheetWeekTable(w) {
  const cols = sheetCols(w), today = todayISO();
  return el("div", {class: "htable-wrap"}, el("table", {class: "htable sheet"},
    el("thead", {}, el("tr", {}, el("th", {}, "Date"), ...cols.map(c => el("th", {}, c.head)))),
    el("tbody", {}, ...w.days.map(d => el("tr", {class: d.date === today ? "now" : ""},
      el("td", {}, el("button", {class: "textbtn", title: "Open the day", onclick: () => go("today", {todayDay: d.date})},
          dayWithName(d.date)),
        d.open ? el("span", {class: "chip today"}, "running") : null,
        d.stale ? el("span", {class: "chip late", title: "A stretch on this day has no end, and counts nothing"}, "no end") : null),
      ...cols.map(c => el("td", {class: c.diff ? diffCls(d.diff) : ""}, c.strong ? el("b", {}, c.cell(d)) : c.cell(d))))),
      el("tr", {class: "tot"}, el("td", {}, w.S.onHand ? "End of week" : "Week"),
        ...cols.map(c => el("td", {class: c.diff ? diffCls(w.diff) : ""}, el("b", {}, c.foot())))))));
}
