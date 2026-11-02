function viewJournalWeek() {
  const now = weekOf(todayISO());
  const id = weekMonday(state.todayWeek) ? state.todayWeek : now;
  const toWeek = w => go("today", {sub: "week", todayDay: null, todayWeek: w === now ? null : w});
  const c = el("div", {class: "wrap" + (visibleSpaces().length > 1 ? " jwide" : "")});
  const late = weekLate(id);
  const head = vhead(id, weekRange(id), journalModes(true, null, id),
    el("div", {class: "daynav daybox weeknav"},
      el("button", {class: "dayarrow", title: "The week before", "aria-label": "The week before", onclick: () => toWeek(shiftWeek(id, -1))}, "◀"),
      el("button", {class: "wkjump", title: "This week", "aria-pressed": String(id === now), onclick: () => toWeek(now)}, "Today"),
      el("button", {class: "dayarrow", title: "The week after", "aria-label": "The week after", onclick: () => toWeek(shiftWeek(id, 1))}, "▶")));
  head.classList.add("todayhead", "weekhead");
  if (late) head.querySelector(".sub").append(" ", el("span", {class: "chip late"}, late + " late"));
  c.append(head, weekSection(id));
  return c;
}
