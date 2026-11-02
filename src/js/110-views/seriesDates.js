/* The single days of a run, from `from` to `until`. */
function seriesDates(when, from, until) {
  const out = [], start = when.start || from;
  const n = Math.max(1, +when.n || 1);
  if (when.mode === "ndays") {
    let d = start, guard = 0;
    while (d < from && guard++ < 5000) d = shiftISO(d, n);
    for (; d <= until; d = shiftISO(d, n)) out.push(d);
    return out;
  }
  const days = (when.days || []).slice().sort(monFirst);
  const monday = shiftISO(start, -((weekdayOf(start) + 6) % 7));
  for (let wk = monday; wk <= until; wk = shiftISO(wk, 7 * n))
    for (const d of days) {
      const day = shiftISO(wk, (d + 6) % 7);
      if (day >= from && day >= start && day <= until) out.push(day);
    }
  return out;
}
