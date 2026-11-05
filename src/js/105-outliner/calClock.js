/* A moment, said the short way: the time today, the day and time otherwise. */
function calClock(ms) {
  const d = new Date(ms), t = pad2(d.getHours()) + ":" + pad2(d.getMinutes());
  return isoOf(d) === todayISO() ? t : d.toLocaleDateString(undefined, {month: "short", day: "numeric"}) + " " + t;
}
