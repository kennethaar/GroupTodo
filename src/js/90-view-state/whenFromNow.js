/* "in 45 minutes", "in 2 hours", "om 20 min" -> {day, time} that far from now,
   or null. Said that way the moment is the reminder, so it goes off then. */
function whenFromNow(p) {
  const m = /^(?:in|om)\s+(an?|one|en|ett|\d{1,4})\s*(m|min|mins|minutes?|minutt(?:er)?|h|hrs?|hours?|t|timer?|time)$/.exec(trim(p).toLowerCase());
  if (!m) return null;
  const n = /^\d/.test(m[1]) ? Number(m[1]) : 1;
  const at = new Date(Date.now() + n * (/^[ht]/.test(m[2]) ? 60 : 1) * 60000);
  return {day: at.getFullYear() + "-" + pad2(at.getMonth() + 1) + "-" + pad2(at.getDate()),
          time: pad2(at.getHours()) + ":" + pad2(at.getMinutes())};
}
