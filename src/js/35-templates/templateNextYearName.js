/* ---------- templates that run out ----------
   2026, 2026-Monday, 2026-W38, 2026-Q4, 2026-10, 2026-10-19 only apply in
   2026. In December, and in January for whatever has just stopped, the ones
   with no copy for the next year are listed, and one button makes the copies. */
function templateNextYearName(name, year) {
  const days = WEEKDAY_NAMES.flat().join("|");
  const m = new RegExp("^" + year + "(-(?:W\\d{2}|Q[1-4]|H[12]|\\d{2}|\\d{2}-\\d{2}|" + days + "))?$").exec(name);
  if (!m) return null;
  const next = (year + 1) + (m[1] || "");
  const ymd = /^(\d{4})-(\d{2})-(\d{2})$/.exec(next);
  // 29 February has no next year to go to.
  if (ymd && new Date(+ymd[1], +ymd[2] - 1, +ymd[3]).getDate() !== +ymd[3]) return null;
  return next;
}
