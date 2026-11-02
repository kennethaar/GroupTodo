/* ---------- how far a chore has come round ----------
   A repeat that is a chore -- the floor, the bins, the windows -- is not late
   the way a deadline is late. A daily one two days over is worse off than a
   monthly one two days over, so it is measured in rounds: 0 just done, 1 its
   day, 2 a whole round late. Read off what the file already says, the
   repeat:: and the day the open one is for, so nothing is stored. A hold
   that ended counts as done that day: a fortnight away is not a fortnight
   of dust. */
function repeatSpan(spec, due) {
  const step = parseRepeat(spec);
  if (step) return step.unit === "weekday" ? 7
    : step.unit === "month" ? dateDiffDays(addMonths(due, -step.n), due) : step.n;
  const rule = parseRule(spec);
  const next = rule && ruleDates(rule, due, shiftISO(due, 1))[0];
  return next ? dateDiffDays(due, next) : null;
}
