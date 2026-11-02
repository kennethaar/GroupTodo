/* The words -> {freq, n, days?, mday?, nth?, wd?, month?}, or null. */
function parseRule(spec) {
  let t = trim(String(spec || "")).toLowerCase().replace(/\s+/g, " ").replace(/[.;]+$/, "");
  if (!t) return null;
  if (/^(?:every )?(?:week ?day|working day|work ?day)s?$/.test(t)) return {freq: "week", n: 1, days: [1, 2, 3, 4, 5]};
  t = t.replace(/^(daily|weekly|fortnightly|biweekly|monthly|quarterly|yearly|annually|annual)\b/, (_, w) => "every " + RULE_ALIAS[w]);
  t = t.replace(/^every other /, "every 2 ");
  const m = /^(?:every|each) (?:(\d{1,3}) )?(day|week|fortnight|month|quarter|year)s?(?: on (.+))?$/.exec(t);
  if (!m) {
    // "every monday", "every mon and thu", "mondays"
    const days = ruleDays(t.replace(/^(?:every|each|on) /, ""));
    return days ? {freq: "week", n: 1, days} : null;
  }
  const unit = m[2];
  let n = Number(m[1] || 1);
  if (!n) return null;
  if (unit === "fortnight") n *= 2;
  if (unit === "quarter") n *= 3;
  const r = {freq: RULE_UNIT[unit], n};
  const on = trim((m[3] || "").replace(/^the /, "the "));
  if (!on) return r;
  if (r.freq === "day") return null;
  if (r.freq === "week") {
    const days = ruleDays(on);
    return days ? Object.assign(r, {days}) : null;
  }
  if (r.freq === "month") {
    const d = /^(?:the |day )?(\d{1,2})(?:st|nd|rd|th)?$/.exec(on);
    if (d && +d[1] >= 1 && +d[1] <= 31) return Object.assign(r, {mday: +d[1]});
    if (/^(?:the )?last day$/.test(on)) return Object.assign(r, {mday: 31});
    const nd = ruleNthDay(on);
    return nd ? Object.assign(r, nd) : null;
  }
  // a year: "15 march", "march 15th", "the first monday of june"
  let d = /^(\d{1,2})(?:st|nd|rd|th)? (?:of )?([a-z]+)$/.exec(on);
  if (d && ruleMonth(d[2]) >= 0 && +d[1] >= 1 && +d[1] <= 31) return Object.assign(r, {mday: +d[1], month: ruleMonth(d[2])});
  d = /^([a-z]+) (\d{1,2})(?:st|nd|rd|th)?$/.exec(on);
  if (d && ruleMonth(d[1]) >= 0 && +d[2] >= 1 && +d[2] <= 31) return Object.assign(r, {mday: +d[2], month: ruleMonth(d[1])});
  d = /^(.+) (?:of|in) ([a-z]+)$/.exec(on);
  const nd = d && ruleNthDay(d[1]);
  if (nd && ruleMonth(d[2]) >= 0) return Object.assign(r, nd, {month: ruleMonth(d[2])});
  return null;
}
