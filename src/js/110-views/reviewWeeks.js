function reviewWeeks() {
  const c = el("div", {class: "rweeks" + (visibleSpaces().length > 1 ? " jwide" : ""), id: "rsec-weeks"});
  const past = unfinishedPast();
  if (past.length) c.append(reviewFold("@past", {}, ["Unfinished from past weeks", el("span", {class: "plain"}, "· " + past.length)],
    pagedCard(past, weekItem, "", 12)));
  const now = weekOf(todayISO()), weeks = [0, 1, 2].map(n => shiftWeek(now, n));
  const label = (w, i) => (i === 0 ? "This week" : i === 1 ? "Next week" : weekRange(w, false)) + " (W" + weekNo(w) + ")";
  c.append(reviewFold("@weeks", {}, ["Calendar and coming weeks"],
    el("div", {class: "wkseg", role: "tablist", "aria-label": "Which week"}, ...weeks.map((w, i) =>
      el("button", {role: "tab", "aria-selected": String(i === REVIEW_WEEK), onclick: () => { REVIEW_WEEK = i; render(); }}, label(w, i)))),
    weekSection(weeks[REVIEW_WEEK])));
  return c;
}
