/* Trackers > a sheet: the previous week first, since that is the one being
   handed in, and the year under it. */
function viewSheet(S) {
  const c = el("div", {});
  const thisMon = weekStartISO(todayISO()), lastMon = shiftISO(thisMon, -7);
  const monday = state.sheetWeek ? weekStartISO(state.sheetWeek) : lastMon;
  const to = patch => sheetNav(S, Object.assign({sheetWeek: monday}, patch));
  const w = sheetWeek(S, monday), unit = sheetUnit(S);
  c.append(fbar(
    el("button", {class: "dayarrow", title: "The week before", "aria-label": "The week before", onclick: () => to({sheetWeek: shiftISO(monday, -7)})}, "◀"),
    el("b", {style: "font-size:13px"}, weekLabel(monday)),
    el("button", {class: "dayarrow", title: "The week after", "aria-label": "The week after", onclick: () => to({sheetWeek: shiftISO(monday, 7)})}, "▶"),
    monday !== lastMon ? el("button", {class: "textbtn", onclick: () => to({sheetWeek: lastMon})}, "Last week") : null,
    monday !== thisMon ? el("button", {class: "textbtn", onclick: () => to({sheetWeek: thisMon})}, "This week") : null,
    el("span", {class: "gap"}),
    el("button", {class: "btn sm ghost", onclick: () => openSheetSettings(S)}, "Settings")));
  c.append(el("div", {class: "section"}, el("div", {class: "reportsum"},
    el("b", {}, fmtSheet(S, w.total) + (unit ? " " + unit : "")),
    S.onHand ? " on hand at the end of the week" : " in " + w.count + " day(s)",
    w.diff != null ? el("span", {class: diffCls(w.diff)}, " · " + S.diff.head.toLowerCase() + " " + fmtSheet(S, w.diff, true)) : null,
    el("button", {class: "btn sm ghost", style: "margin-left:auto", onclick: () => copySheetWeek(w)}, "Copy as text"))));
  const notes = [
    w.extra ? fmtSheet(S, w.extra) + " is added to each day with anything on it." : "",
    w.target ? S.diff.head + " is against " + sheetTargetText(S, w.target) + "." : S.diff ? "Set " + S.diff.target.toLowerCase() + " in Settings to see " + S.diff.head.toLowerCase() + "." : "",
    w.days.some(d => d.stale) ? "A stretch with no end counts nothing until it has one." : ""].filter(Boolean).join(" ");
  c.append(section("Days", null, el("div", {class: "card"}, sheetWeekTable(w),
    notes ? el("div", {class: "hint", style: "text-align:left;padding:8px 12px;margin:0;border-top:1px solid var(--border)"}, notes) : null)));
  if (S.id === "clients") {
    const pr = clientProjects(w);
    if (pr) c.append(pr);
    if (!sheetEntries(S).length) c.append(emptyCard("Nothing clocked yet. Set a todo in a project to Doing and the clock runs until it " +
      "is Done or set back; the project's organisation (org:: on its page or its area) is the client."));
  }
  const years = [...new Set([...sheetEntries(S).map(e => e.date.slice(0, 4)), monday.slice(0, 4)])].sort().reverse();
  const year = state.sheetYear && years.includes(state.sheetYear) ? state.sheetYear : monday.slice(0, 4);
  const y = sheetYear(S, year), ycols = sheetYearCols(y);
  const ytab = el("div", {class: "htable-wrap"}, el("table", {class: "htable"},
    el("thead", {}, el("tr", {}, el("th", {}, "Month"), ...ycols.map(col => el("th", {}, col.head)))),
    el("tbody", {}, ...y.months.map(m => el("tr", {class: m.key === todayISO().slice(0, 7) ? "now" : ""},
      el("td", {}, capitalise(m.label)), ...ycols.map(col => el("td", {}, col.cell(m))))),
      el("tr", {class: "tot"}, el("td", {}, S.onHand ? "End of year" : "Year"), ...ycols.map(col => el("td", {}, el("b", {}, col.foot())))))));
  c.append(section(S.days ? "Days per month" : "Per month", null, el("div", {class: "card"}, ytab),
    el("span", {style: "margin-left:auto;display:flex;gap:6px;align-items:center"},
      fselect("Year", year, years.map(v => [v, v]), v => to({sheetYear: v})),
      el("button", {class: "btn sm ghost", onclick: () => copySheetYear(y)}, "Copy as text"))));
  return c;
}
