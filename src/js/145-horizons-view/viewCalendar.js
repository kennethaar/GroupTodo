function viewCalendar() {
  const c = el("div", {});
  const anchor = state.calMonth || todayISO().slice(0, 7);
  const picked = state.calDay && state.calDay.slice(0, 7) === anchor ? state.calDay
               : (todayISO().slice(0, 7) === anchor ? todayISO() : anchor + "-01");
  const byDay = new Map();
  for (const a of leafActions().filter(a => a.due)) {
    if (!byDay.has(a.due)) byDay.set(a.due, []);
    byDay.get(a.due).push(a);
  }
  // Birthdays are not tasks, so they are drawn beside them rather than among them.
  const bdays = new Map();             // "MM-DD" -> people, every year alike
  for (const b of birthdays()) {
    const k = b.day.slice(5);
    if (!bdays.has(k)) bdays.set(k, []);
    bdays.get(k).push(b);
  }

  const shift = n => {
    const [y, m] = anchor.split("-").map(Number);
    const d = new Date(Date.UTC(y, m - 1 + n, 1));
    go("next", {sub: "calendar", calMonth: d.toISOString().slice(0, 7), calDay: null});
  };
  const title = new Date(anchor + "-01T00:00:00Z")
    .toLocaleDateString(undefined, {month: "long", year: "numeric", timeZone: "UTC"});
  c.append(el("div", {class: "section", style: "display:flex;gap:8px;align-items:center"},
    el("button", {class: "btn sm ghost", title: "Previous month", onclick: () => shift(-1)}, "\u2039"),
    el("h2", {style: "margin:0;flex:1"}, title),
    el("button", {class: "btn sm ghost",
      onclick: () => go("next", {sub: "calendar", calMonth: todayISO().slice(0, 7), calDay: todayISO()})}, "Today"),
    el("button", {class: "btn sm ghost", title: "Next month", onclick: () => shift(1)}, "\u203A")));

  /* Everything dated in the next two weeks, sent to the calendar you already
     use: a file built here, or that calendar's own new-event screen. Nothing
     is ever subscribed. */
  const soon = leafActions().filter(a => a.due && a.due >= todayISO() && a.due <= shiftISO(todayISO(), CFG.agendaDays));
  if (soon.length) c.append(fbar(
    el("button", {class: "btn sm", onclick: () => addToCalendar(soon)}, "\u25F7 Add the next " + CFG.agendaDays + " days to your calendar (" + soon.length + ")"),
    el("button", {class: "textbtn", onclick: () => openCalendarPicker(soon)}, "Choose where")));
  const grid = el("div", {class: "cal"});
  for (const name of ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"])
    grid.append(el("div", {class: "cal-dow"}, name));
  for (const day of monthGrid(anchor)) {
    const items = byDay.get(day) || [];
    const outside = day.slice(0, 7) !== anchor;
    const late = a => a.due < todayISO() && OPEN_STATES[a.state];
    // The whole square is the control: on a phone, picking a day is the gesture,
    // and the day's tasks are listed underneath where there is room to read them.
    const cell = el("button", {
      class: "cal-day" + (outside ? " out" : "") + (day === todayISO() ? " today" : "") +
             (day === picked ? " picked" : ""),
      onclick: () => go("next", {sub: "calendar", calMonth: day.slice(0, 7), calDay: day}),
    }, el("div", {class: "cal-num"}, String(Number(day.slice(8)))));
    const box = el("div", {class: "cal-items"});
    for (const b of bdays.get(day.slice(5)) || [])
      box.append(el("span", {class: "cal-item bday", title: b.name + "'s birthday"}, b.name));
    for (const a of items.slice(0, 4))
      box.append(el("span", {class: "cal-item" + (late(a) ? " late" : ""),
        title: plainTitle(a.title)}, plainTitle(a.title)));
    if (items.length > 4) box.append(el("span", {class: "cal-more"}, "+" + (items.length - 4)));
    cell.append(box);
    grid.append(cell);
  }
  c.append(grid);

  const dayItems = (byDay.get(picked) || []);
  for (const b of bdays.get(picked.slice(5)) || [])
    c.append(el("div", {class: "section quiet"},
      el("button", {class: "btn sm ghost", onclick: () => openPageIn(b.space, b.path)},
        b.name + "'s birthday" + (b.age && picked.slice(0, 4) === b.day.slice(0, 4) ? " · " + b.age : ""))));
  // humanDate already says "Today", so do not say it twice.
  c.append(section(humanDate(picked), dayItems.length,
    taskCard(dayItems, "Nothing due on this day.")));

  if (!byDay.size) c.append(el("div", {class: "section quiet"},
    el("div", {style: "color:var(--fg3);font-size:12.5px"},
      "Nothing has a date yet. Give a task a scheduled day or a deadline and it lands here.")));
  return c;
}
