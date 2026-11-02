/* On Today, under the trackers: each sheet with something this week, how the
   day and the week stand, and the way into it. */
function sheetsToday(day) {
  const out = [];
  for (const S of SHEETS) {
    if (S.onHand || !sheetEntries(S).some(e => e.date >= shiftISO(day, -60) && e.date <= day)) continue;
    const w = sheetWeek(S, weekStartISO(day)), d = w.days.find(x => x.date === day), unit = sheetUnit(S);
    out.push(el("button", {class: "cd", title: "The " + S.title.toLowerCase() + " sheet",
      onclick: () => sheetNav(S, {sheetWeek: weekStartISO(day)})},
      el("span", {class: "cd-k"}, S.title),
      el("span", {class: "cd-t"}, (d.any ? (day === todayISO() ? "today " : "this day ") + fmtSheet(S, d.total) + " · " : "") +
        "week " + fmtSheet(S, w.total) + (unit ? " " + unit : "")),
      w.diff != null ? el("span", {class: "cd-left " + diffCls(w.diff)}, S.diff.head.toLowerCase() + " " + fmtSheet(S, w.diff, true)) : null));
  }
  return out.length ? el("div", {class: "countdown sheetsum"}, ...out) : null;
}
