/* The next `count` days it falls on, from `from` on, its end allowed for. */
function routineDates(path, from = todayISO(), count = 1) {
  const s = routineSchedule(path);
  if (!s || (s.times != null && s.runs >= s.times)) return [];
  const anchor = s.starts || from;
  let left = s.times != null ? s.times - s.runs : count;
  if (s.last && s.last >= from) from = shiftISO(s.last, 1);
  return ruleDates(s.rule, anchor, from, Math.min(count, left)).filter(d => !s.ends || d <= s.ends);
}
