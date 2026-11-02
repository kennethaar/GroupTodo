/* "every weekday at 08:00 · next Thu 29 Oct", for the pill and the Settings list. */
function routineSummary(path) {
  const s = routineSchedule(path);
  if (!s) return cadenceOf(path) || "as needed";
  const bits = [formatRule(s.rule) + (s.time ? " at " + s.time : "")];
  if (s.starts && s.starts > todayISO()) bits.push("from " + humanDate(s.starts));
  if (s.ends) bits.push("until " + humanDate(s.ends));
  if (s.times != null) bits.push(Math.min(s.runs, s.times) + " of " + s.times + " times");
  const next = routineDates(path)[0];
  bits.push(next ? "next " + humanDate(next).replace(/^(Today|Tomorrow)$/, w => w.toLowerCase()) : "ended");
  return bits.join(" · ");
}
