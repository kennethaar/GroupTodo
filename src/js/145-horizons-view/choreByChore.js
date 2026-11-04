/* ---------- group chores by chore (#260) ----------
   One chore is done in several rooms. Grouped by chore, each gets one heading
   that says how many rooms and how long in all, with a line for each room. */
function choreByChore(rows, roomOf) {
  const groups = new Map();
  for (const a of rows) {
    const k = choreKey(a.title);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(a);
  }
  return [...groups.values()].map(list => {
    const rooms = new Set(list.map(roomOf)).size, mins = list.reduce((n, a) => n + (estMinutes(a.title) || 0), 0);
    return {name: choreWords(list[0].title), list, says: rooms + (rooms === 1 ? " room" : " rooms") + (mins ? " · " + minutesText(mins) : "")};
  }).sort((x, y) => x.name.localeCompare(y.name));
}
