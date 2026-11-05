/* ---------- the chores on paper (#235) ----------
   For the people at home who read the fridge, not the app. Print takes the
   view as it is -- the room and whose chores picked -- and puts what is due
   now and this week on one sheet, by room, in the order of the room sort.
   Nothing to set: change the view to change the sheet. Black on white, so
   LATE is said in capitals rather than in red. */
function choreSheet(rows, rooms, roomOf, nameOf, picked, by) {
  const t = todayISO(), weekday = new Intl.DateTimeFormat(undefined, {weekday: "short"});
  const when = a => !a.due ? "now" : a.due < t ? "LATE" : a.due === t ? "today" : weekday.format(parseISO(a.due));
  const turns = choreCrew().length > 1;
  const order = (x, y) => (x.due || "").localeCompare(y.due || "") || choreRounds(y) - choreRounds(x);
  const body = [];
  /* By chore (#260) the heading is the chore and each line a room. */
  const parts = by === "chore" ? choreByChore(rows, roomOf).map(g => ({head: g.name + " · " + g.says, list: g.list}))
    : rooms.map(k => ({head: nameOf(k).replace(/^@/, ""), list: rows.filter(a => roomOf(a) === k)}));
  for (const {head, list} of parts) {
    list.sort(order);
    if (!list.length) continue;
    const first = !body.length, th = (cls, text) => el("th", {class: cls}, first ? text : "");
    body.push(el("tr", {class: "ps-room"}, el("th", {colspan: "2"}, head),
      th("ps-when", "when"), th("", "how often"), th("ps-time", "time"), turns ? th("", "whose") : null));
    for (const a of list) {
      const mins = estMinutes(a.title), who = turns ? turnFor(a) : "";
      body.push(el("tr", {},
        el("td", {class: "ps-tick"}, el("span", {class: "ps-box"})),
        el("td", {}, by === "chore" ? nameOf(roomOf(a)).replace(/^@/, "") : titleForRow(a.title)),
        el("td", {class: "ps-when" + (a.due && a.due < t ? " ps-late" : "")}, when(a)),
        el("td", {}, repeatOf(a.block)),
        el("td", {class: "ps-time"}, mins ? minutesText(mins) : ""),
        turns ? el("td", {}, who ? firstNameOf(who) : "") : null));
    }
  }
  const all = parts.flatMap(p => p.list);
  const who = new Map();
  if (turns) for (const a of all) { const n = turnFor(a); if (n) who.set(firstNameOf(n), [...(who.get(firstNameOf(n)) || []), a]); }
  const totals = all.length ? el("div", {class: "ps-total"},
    el("div", {}, "This week · " + [choreTotal(all), all.length + (all.length === 1 ? " chore" : " chores")].filter(Boolean).join(" · ")),
    who.size ? el("div", {}, [...who].map(([n, l]) => n + " · " + choreTotal(l)).join("    ")) : null) : null;
  const sub = ["Tick it here, then tick it in the app.", ...picked.filter(Boolean)].join(" · ");
  return el("div", {class: "ps"},
    el("div", {class: "ps-h"}, el("h1", {}, "Chores · week " + isoWeek(t)[0]),
      el("span", {}, "Printed " + dateFormat(false).format(new Date()))),
    el("div", {class: "ps-sub"}, sub),
    el("table", {}, el("tbody", {}, ...body)),
    totals,
    el("div", {class: "ps-notes"}, "Notes", el("i"), el("i"), el("i")));
}
