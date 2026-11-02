/* The seven days side by side; on a phone one under the other, an empty day
   only its name. A day's name opens that day. */
function weekGrid(id) {
  const today = todayISO(), roll = weekRollup(id);
  return el("div", {class: "wkgrid"}, ...weekDays(id).map(d => {
    const items = roll.get(d), dt = parseISO(d);
    const open = () => go("today", {sub: null, todayWeek: null, todayDay: d === today ? null : d});
    return el("section", {class: "wkday" + (d === today ? " today" : "") + (items.length ? "" : " empty"), data: {day: d}},
      el("button", {class: "wkdayhead", title: "Open " + dayLong(d), onclick: open},
        capitalise(dt.toLocaleDateString(undefined, {weekday: "short"})) + " " + dt.getDate(),
        el("span", {class: "wkmon"}, " " + dt.toLocaleDateString(undefined, {month: "short"})), " ↗",
        d === today ? el("span", {class: "wktoday"}, "Today") : null),
      ...items.map(weekItem));
  }));
}
