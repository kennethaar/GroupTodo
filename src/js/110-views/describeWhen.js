function describeWhen(w) {
  if (!w) return "only where you write it";
  const wd = days => days.slice().sort(monFirst).map(d => WEEKDAY_NAMES[d][0].slice(0, 3)).join(", ");
  const nth = d => d + (d % 10 === 1 && d !== 11 ? "st" : d % 10 === 2 && d !== 12 ? "nd" : d % 10 === 3 && d !== 13 ? "rd" : "th");
  const mode = whenMode(w);
  return mode === "daily" ? "every day"
    : mode === "weekly" ? wd(w.days)
    : mode === "ndays" ? "every " + w.n + " days"
    : mode === "nweeks" ? (w.n === 1 ? "every " : "every " + w.n + " weeks on ") + wd(w.days)
    : mode === "monthdays" ? "the " + w.mdays.slice().sort((a, b) => a - b).map(nth).join(", ") + " of the month"
    : mode === "months" ? "every day in " + w.months.slice().sort((a, b) => a - b).map(m => capitalise(MONTH_WORDS[m - 1])).join(", ")
    : "on " + w.dates.length + " set day" + (w.dates.length === 1 ? "" : "s");
}
