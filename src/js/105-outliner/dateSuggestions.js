function dateSuggestions(frag) {
  const f = whenEnglish(trim(frag).toLowerCase());
  if (f.length < 2) return [];
  const out = [];
  const m = /^in (\d{1,3})(?: (m\w*|h\w*|d\w*|w\w*))?$/.exec(f);
  if (m) for (const unit of ["minutes", "hours", "days", "weeks", "months"])
    if (!m[2] || unit.startsWith(m[2])) out.push("in " + m[1] + " " + unit);
  for (const w of DATE_WORDS) if (w.startsWith(f) && w !== f && !out.includes(w)) out.push(w);
  if ((dateFromWords(f) || whenClock(f) || whenDay(f, todayISO()) || dayAndClock(f)) && !out.includes(f)) out.unshift(f);
  return out.slice(0, 5).map(dateSuggestion).filter(r => r.iso);
}
