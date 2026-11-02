/* "6 days ago", "yesterday", "Tue, Oct 21, 2026, 3:15 PM (6 days ago)" ->
   a date; anything else stays the words it was. */
function mailDateISO(s) {
  s = mailDateClean(s);
  const shift = n => shiftISO(todayISO(), -n);
  const rel = /(\d+)\s*(minute|min|hour|day|week)s?\s+ago/i.exec(s);
  if (rel) {
    const n = +rel[1], unit = rel[2].toLowerCase();
    return shift(unit === "day" ? n : unit === "week" ? n * 7 : 0);
  }
  if (/\b(?:yesterday|gestern|i ?går)\b/i.test(s)) return shift(1);
  if (/^\d{1,2}[:.]\d{2}/.test(s) || /\btoday\b/i.test(s)) return todayISO();
  const d = new Date(s.replace(/\(.*?\)/g, "").replace(/\s+at\s+/i, " "));
  return isNaN(d.getTime()) ? s : isoOf(d);
}
