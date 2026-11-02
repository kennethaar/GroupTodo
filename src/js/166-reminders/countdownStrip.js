/* The strip on Today: the next task with a time and the next deadline, each
   with how long until it. Only what exists is shown, so
   most mornings it is one line or nothing at all. It is for what is close:
   a time within the next day, a deadline today or tomorrow. A meeting next
   week is in Next 7 Days, not up here. */
function countdownStrip() {
  const today = todayISO();
  const ev = upcomingEvents();
  const timed = ev.filter(e => { if (!e.time) return false; const m = minutesUntil(e.day, e.time); return m > -15 && m < 1440; })
    .sort(eventOrder)[0];
  const due = ev.filter(e => e.kind === "task" && e.key === "DEADLINE" && e.day >= today && e.day <= shiftISO(today, 1) && e !== timed)
    .sort(eventOrder)[0];
  const items = [[timed, "Next"], [due, "Due"]].filter(([e]) => e);
  if (!items.length) return null;
  const box = el("div", {class: "section countdown"});
  for (const [e, label] of items) {
    box.append(el("button", {class: "cd", title: e.time ? humanWhen(e.day, e.time) : humanDate(e.day),
      onclick: () => e.kind === "birthday" ? openPageIn(e.b.space, e.b.path)
                                           : inSpace(e.a.space, () => openTaskDetail(e.a.path, e.a.block, e.a.space))},
      el("span", {class: "cd-k"}, label),
      el("span", {class: "cd-t"}, e.title),
      el("span", {class: "cd-left", data: {day: e.day, time: e.time || ""}}, whenUntilWords(e.day, e.time))));
  }
  return box;
}
