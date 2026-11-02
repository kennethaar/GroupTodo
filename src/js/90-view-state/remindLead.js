/* "30m", "1h", "2d", "0" (at the time) or "none" -> minutes before, or null. */
function remindLead(spec) {
  const s = trim(String(spec || "")).toLowerCase();
  if (!s) return remindUsual();
  if (/^(none|off|no|never|nei)$/.test(s)) return null;
  const m = /^(\d{1,4})\s*(m|min|mins|minutes?|h|hours?|t|timer?|d|days?|dager?)?$/.exec(s);
  if (!m) return remindUsual();
  const n = Number(m[1]), u = (m[2] || "m")[0];
  return u === "h" || u === "t" ? n * 60 : u === "d" ? n * 1440 : n;
}
