/* ---------- the week ----------
   The Journal's Week shows a week page -- what belongs to the week and to no
   one day of it -- and under it the seven days, each with only what is dated
   on it: due, starting, waited for, and the meetings. Day notes stay on the
   day. The weekly review shows the same, for this week and the two after. */
const journalModes = (week, day, id) => el("div", {class: "vseg jmode", role: "group", "aria-label": "Day or week"},
  el("button", {"aria-pressed": String(!week), title: "One day", onclick: () => {
    if (!week) return;
    // Today if it is in the week, else its Monday.
    const t = todayISO(), d = weekOf(t) === id ? t : weekMonday(id);
    go("today", {sub: null, todayWeek: null, todayDay: d === t ? null : d});
  }}, "Day"),
  el("button", {"aria-pressed": String(week), title: "The whole week", onclick: () => {
    if (week) return;
    const w = weekOf(day);
    go("today", {sub: "week", todayDay: null, todayWeek: w === weekOf(todayISO()) ? null : w});
  }}, "Week"));

/* The day a dated task is due: its deadline, else the one date it has. One
   with a start and a later deadline starts on the first. */
const taskEnd = b => dateIn(blockProp(b, "DEADLINE")) || dateIn(blockProp(b, "due")) || dateIn(blockProp(b, "SCHEDULED"));
const taskStart = b => {
  const s = dateIn(blockProp(b, "SCHEDULED")), e = taskEnd(b);
  return s && e && s < e ? s : null;
};
