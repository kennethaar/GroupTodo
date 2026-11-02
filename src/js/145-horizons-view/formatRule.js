/* The rule back as words, the way parseRule reads them. */
function formatRule(r) {
  if (!r) return "";
  if (r.freq === "week" && r.n === 1 && String(r.days) === "1,2,3,4,5") return "every weekday";
  let s = r.n === 1 ? {day: "daily", week: "weekly", month: "monthly", year: "yearly"}[r.freq]
                    : "every " + r.n + " " + r.freq + "s";
  const nthDay = () => "the " + RULE_NTH_WORD[r.nth] + " " + WEEKDAYS[r.wd];
  if (r.freq === "week" && r.days && r.days.length) s += " on " + r.days.map(d => WEEKDAYS[d].slice(0, 3)).join(", ");
  if (r.freq === "month") {
    if (r.nth) s += " on " + nthDay();
    else if (r.mday) s += " on the " + ruleOrdinal(r.mday);
  }
  if (r.freq === "year" && r.month != null) {
    if (r.nth) s += " on " + nthDay() + " of " + RULE_MONTHS[r.month];
    else s += " on " + (r.mday || 1) + " " + RULE_MONTHS[r.month];
  }
  return s;
}
