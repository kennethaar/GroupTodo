/* Per place over the last 13 weeks. Every screen and reading is listed, used
   or not: the ones never opened are half the point. */
function usageStats() {
  const today = todayISO(), by = new Map();
  const row = place => by.get(place) || by.set(place, {place, visits: 0, secs: 0, acts: 0,
    days: new Set(), weeks: new Set(), last: null}).get(place);
  let first = null;
  for (const r of usageRecords()) {
    const ago = dateDiffDays(r.day, today);
    if (ago == null || ago < 0 || ago >= USAGE_WEEKS * 7) continue;
    if (!first || r.day < first) first = r.day;
    for (const [place, [v, s, a]] of Object.entries(r.places)) {
      const x = row(place);
      x.visits += v; x.secs += s; x.acts += a;
      x.days.add(r.day); x.weeks.add(Math.floor(ago / 7));
      if (!x.last || r.day > x.last) x.last = r.day;
    }
  }
  for (const view of Object.keys(VIEW_TITLE)) {
    if (view === "search" || view === "me") continue;
    if (SUBS[view]) for (const [s] of SUBS[view]) row(view + "/" + s);
    else row(view);
  }
  // Weeks the log has been running, so the first fortnight is not "used 2 weeks of 13".
  const weeks = first ? Math.min(USAGE_WEEKS, Math.floor(dateDiffDays(first, today) / 7) + 1) : 0;
  return {weeks, rows: [...by.values()]};
}
