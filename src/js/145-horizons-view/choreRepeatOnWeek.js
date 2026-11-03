/* ---------- where a chore's next round goes (#212) ----------
   Written beside the last one, a room page gets a done line every round: 365
   a year for a daily chore. So a chore's next round goes on the Journal, on
   the page for when it is due. A repeat tied to a day -- daily, every monday,
   weekly on mon, thu, monthly on the 15th -- goes on that day's page; one of
   a week or longer that names no day -- weekly, every 2 weeks, monthly -- on
   that week's page. The done line stays where it was ticked, so the history
   ends up on day and week pages, and the room page keeps only what is open.
   The line carries its room, so Chores still finds every round. */
function choreRepeatOnWeek(spec) {
  const r = parseRule(spec);
  if (!r || r.freq === "day") return false;
  if (r.freq === "week") return !(r.days && r.days.length);
  return !r.mday && !r.nth;
}
