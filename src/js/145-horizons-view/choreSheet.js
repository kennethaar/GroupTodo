/* ---------- the chores on paper (#235) ----------
   For the people at home who read the fridge, not the app. Print takes the
   view as it is -- the room and whose chores picked -- and puts the days
   picked on one sheet, by room, in the order of the room sort. Late and due
   now are always on. A chore that comes round more than once in those days
   has a line and a box for each round (#325). Whose turn is said for the
   first round only, unless it is handed to someone: after that it is
   whoever does the first, so it is left to write in, not guessed. Black on
   white, so LATE is said in capitals rather than in red. */
function choreSheet(rows, rooms, roomOf, nameOf, picked, by, range) {
  const t = todayISO(), {from, to} = range || choreRange("week", t);
  const weekday = new Intl.DateTimeFormat(undefined, {weekday: "short"});
  const dayName = new Intl.DateTimeFormat(undefined, {weekday: "short", day: "numeric", month: "short"});
  const when = d => !d ? "now" : d < t ? "LATE" : d === t ? "today" : weekday.format(parseISO(d));
  const turns = choreCrew().length > 1;
  const expand = list => list.flatMap(a => choreRoundsIn(a, from, to).map((day, i) =>
    ({a, day, title: a.title, who: !turns ? "" : i === 0 ? turnFor(a) : a.assignee || ""})));
  const order = (x, y) => x.day.localeCompare(y.day) || choreRounds(y.a) - choreRounds(x.a);
  const body = [];
  /* By chore (#260) the heading is the chore and each line a room. */
  const parts = (by === "chore" ? choreByChore(rows, roomOf).map(g => ({head: g.name + " · " + g.says, list: g.list}))
    : rooms.map(k => ({head: nameOf(k).replace(/^@/, ""), list: rows.filter(a => roomOf(a) === k)})))
    .map(p => ({head: p.head, list: expand(p.list).sort(order)}));
  for (const {head, list} of parts) {
    if (!list.length) continue;
    const first = !body.length, th = (cls, text) => el("th", {class: cls}, first ? text : "");
    body.push(el("tr", {class: "ps-room"}, el("th", {colspan: "2"}, head),
      th("ps-when", "when"), th("", "how often"), th("ps-time", "time"), turns ? th("", "whose") : null));
    for (const {a, day, who} of list) {
      const mins = estMinutes(a.title);
      body.push(el("tr", {},
        el("td", {class: "ps-tick"}, el("span", {class: "ps-box"})),
        el("td", {}, by === "chore" ? nameOf(roomOf(a)).replace(/^@/, "") : titleForRow(a.title)),
        el("td", {class: "ps-when" + (day && day < t ? " ps-late" : "")}, when(day)),
        el("td", {}, repeatOf(a.block)),
        el("td", {class: "ps-time"}, mins ? minutesText(mins) : ""),
        turns ? el("td", {}, who ? firstNameOf(who) : "") : null));
    }
  }
  const all = parts.flatMap(p => p.list);
  const who = new Map();
  for (const r of all) if (r.who) { const n = firstNameOf(r.who); who.set(n, [...(who.get(n) || []), r]); }
  const totals = all.length ? el("div", {class: "ps-total"},
    el("div", {}, "In all · " + [choreTotal(all), all.length + (all.length === 1 ? " chore" : " chores")].filter(Boolean).join(" · ")),
    who.size ? el("div", {}, [...who].map(([n, l]) => n + " · " + choreTotal(l)).join("    ")) : null) : null;
  const sub = ["Tick it here, then tick it in the app.", ...picked.filter(Boolean)].join(" · ");
  const days = from === to ? dayName.format(parseISO(from)) : dayName.format(parseISO(from)) + " – " + dayName.format(parseISO(to));
  return el("div", {class: "ps"},
    el("div", {class: "ps-h"}, el("h1", {}, "Chores · " + days),
      el("span", {}, "Printed " + dateFormat(false).format(new Date()))),
    el("div", {class: "ps-sub"}, sub),
    el("table", {}, el("tbody", {}, ...body)),
    totals,
    el("div", {class: "ps-notes"}, "Notes", el("i"), el("i"), el("i")));
}
