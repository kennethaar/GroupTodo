/* How long ago, said the short way. */
function calAgo(ms) {
  const s = (Date.now() - ms) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return Math.floor(s / 60) + " min ago";
  const d = new Date(ms);
  return isoOf(d) === todayISO() ? "at " + pad2(d.getHours()) + ":" + pad2(d.getMinutes())
    : d.toLocaleDateString(undefined, {month: "short", day: "numeric"});
}
