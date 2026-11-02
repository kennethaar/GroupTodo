/* "14:32" today, "Yesterday 14:32", "Mon 14:32" this week, else a date.
   The clock is asked for as a time, not sliced out of a formatted datetime:
   pulling /\d+:\d+/ out of "6 Oct 2026, 2:02 pm" gives "2:02" and loses the
   afternoon, which is the kind of wrong that gets somebody to a meeting late. */
function chatTime(stamp) {
  const day = dateIn(stamp);
  const t = formatStamp(stamp);
  const clock = formatStamp(stamp, {dateStyle: undefined, timeStyle: "short"});
  if (!day) return t;
  if (day === todayISO()) return clock || t;
  if (day === shiftISO(todayISO(), -1)) return "Yesterday" + (clock ? " " + clock : "");
  if (day > shiftISO(todayISO(), -7)) {
    const wd = new Date(day + "T00:00:00Z").getUTCDay();
    return WEEKDAYS[wd].slice(0, 3).replace(/^./, c => c.toUpperCase()) + (clock ? " " + clock : "");
  }
  return humanDate(day) + (clock ? " " + clock : "");
}
