/* The next one after `from`, always strictly later: ticking a chore off late
   should still put the next one in the future, not in the past. */
function nextRepeatDate(spec, from) {
  const step = parseRepeat(spec);
  const base = dateIn(from) || todayISO();
  if (!step) {
    // "weekly on mon, thu", "monthly on the last friday": the rule's next day after both.
    const rule = parseRule(spec);
    if (!rule) return null;
    const after = shiftISO(base > todayISO() ? base : todayISO(), 1);
    return ruleDates(rule, base, after)[0] || null;
  }
  if (step.unit === "weekday") {
    const cur = new Date(base + "T00:00:00Z").getUTCDay();
    let ahead = (step.n - cur + 7) % 7;
    if (ahead === 0) ahead = 7;
    return shiftISO(base, ahead);
  }
  let next = step.unit === "month" ? addMonths(base, step.n) : shiftISO(base, step.n);
  // A monthly chore ticked three months late should land next month, not in May.
  let guard = 0;
  while (next <= todayISO() && guard++ < 60)
    next = step.unit === "month" ? addMonths(next, step.n) : shiftISO(next, step.n);
  return next;
}
