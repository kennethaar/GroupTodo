/* ---------- reading a schedule back ----------
   From the templates the line is in, the way they would have been written.
   Several kinds at once -- a weekday and some months, say -- reads as the
   first, and the rest are named so the editor can say they will be replaced.
   Templates for days gone by are history and do not count. */
function inferSeries(dates) {
  if (dates.length < 2) return dates.length ? {mode: "dates", dates} : null;
  const start = dates[0], last = dates[dates.length - 1];
  const gap = (a, b) => Math.round((parseISO(b) - parseISO(a)) / 864e5);
  const gaps = dates.slice(1).map((d, i) => gap(dates[i], d));
  const cands = [];
  if (gaps.every(g => g === gaps[0])) cands.push(gaps[0] % 7 === 0
    ? {mode: "nweeks", n: gaps[0] / 7, days: [weekdayOf(start)], start}
    : {mode: "ndays", n: gaps[0], start});
  const days = [...new Set(dates.map(weekdayOf))];
  const span = Math.min(...days.map(d => { const ds = dates.filter(x => weekdayOf(x) === d); return ds.length > 1 ? gap(ds[0], ds[1]) : Infinity; }));
  if (span !== Infinity && span % 7 === 0) cands.push({mode: "nweeks", n: span / 7, days, start});
  // A reading only counts if it writes these very days back.
  for (const c of cands) if (seriesDates(c, start, last).join() === dates.join()) return c;
  return {mode: "dates", dates};
}
