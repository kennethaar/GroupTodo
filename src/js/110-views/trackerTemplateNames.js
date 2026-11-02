/* The templates a schedule is written into. Templates named for a year carry
   next year's too in December, so a tracker set up now does not run out in a
   few weeks. */
function trackerTemplateNames(when, from) {
  const y = +from.slice(0, 4);
  const years = from.slice(5, 7) === "12" ? [y, y + 1] : [y];
  const mode = whenMode(when);
  if (mode === "daily") return years.map(String);
  if (mode === "weekly") return years.flatMap(year => when.days.slice().sort(monFirst).map(d => year + "-" + WEEKDAY_NAMES[d][0]));
  // The next of each month picked, a year on from now: June asked for in October is next year's.
  if (mode === "months") return [y, y + 1].flatMap(year => when.months.slice().sort((a, b) => a - b).map(m => year + "-" + pad2(m)))
    .filter(n => n >= from.slice(0, 7) && n < (y + 1) + from.slice(4, 7));
  if (mode === "monthdays") {
    const out = [], mdays = when.mdays.slice().sort((a, b) => a - b);
    for (let m = 1; m <= 12; m++) for (const d of mdays) if (d <= MONTH_LEN[m - 1]) out.push(pad2(m) + "-" + pad2(d));
    return out;
  }
  return seriesDates(when, from, shiftISO(from, SERIES_AHEAD));
}
