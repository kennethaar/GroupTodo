/* Minutes on site. Out before in is a night shift, over midnight. A visit still
   open today counts up to now; one left open on an earlier day counts nothing,
   since nobody wrote down when they left. */
function timeLogMinutes(b, date) {
  const a = clockMin(blockProp(b, "in")), z = clockMin(blockProp(b, "out"));
  if (a != null && z != null) return (z - a + 1440) % 1440;
  const h = parseFloat(String(blockProp(b, "hours") || "").replace(",", "."));
  if (isFinite(h) && h > 0) return Math.round(h * 60);
  if (a != null && date === todayISO()) return Math.max(0, clockMin(nowClock()) - a);
  return null;
}
