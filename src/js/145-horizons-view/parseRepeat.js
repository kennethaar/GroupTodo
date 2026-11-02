/* "weekly", "every 2 weeks", "monthly", "every monday" -> a step, or null. */
function parseRepeat(spec) {
  const t = trim(String(spec || "")).toLowerCase().replace(/^every\s+/, "");
  if (!t) return null;
  const named = {
    day: ["day", 1], daily: ["day", 1],
    week: ["day", 7], weekly: ["day", 7],
    fortnight: ["day", 14], fortnightly: ["day", 14], biweekly: ["day", 14],
    month: ["month", 1], monthly: ["month", 1],
    quarter: ["month", 3], quarterly: ["month", 3],
    year: ["month", 12], yearly: ["month", 12], annually: ["month", 12], annual: ["month", 12],
  }[t];
  if (named) return {unit: named[0], n: named[1]};

  const wd = WEEKDAYS.indexOf(t.replace(/s$/, ""));
  if (wd >= 0) return {unit: "weekday", n: wd};

  const m = /^(\d{1,3})\s*(day|week|month|year)s?$/.exec(t);
  if (m) {
    const n = Number(m[1]);
    if (!n) return null;
    if (m[2] === "day")   return {unit: "day",   n};
    if (m[2] === "week")  return {unit: "day",   n: n * 7};
    if (m[2] === "month") return {unit: "month", n};
    return {unit: "month", n: n * 12};
  }
  return null;
}
