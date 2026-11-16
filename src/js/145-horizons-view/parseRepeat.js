/* "weekly", "every 2 weeks", "monthly", "every monday" -> a step, or null.
   Read through parseRule, so a repeat has one set of words (#396); a rule
   that needs more than one step -- several days, the 1st of the month --
   is parseRule's alone. */
function parseRepeat(spec) {
  const t = trim(String(spec || "")).toLowerCase();
  if (!t) return null;
  const r = parseRule(t) || (/^(every|each) /.test(t) ? null : parseRule("every " + t));
  if (!r || r.mday || r.nth || r.month != null) return null;
  if (r.days) return r.days.length === 1 && r.n === 1 ? {unit: "weekday", n: r.days[0]} : null;
  if (r.freq === "day") return {unit: "day", n: r.n};
  if (r.freq === "week") return {unit: "day", n: 7 * r.n};
  if (r.freq === "month") return {unit: "month", n: r.n};
  if (r.freq === "year") return {unit: "month", n: 12 * r.n};
  return null;
}
