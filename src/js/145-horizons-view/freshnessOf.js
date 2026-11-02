function freshnessOf(a) {
  const b = a.block, spec = b && OPEN_STATES[b.state] ? repeatOf(b) : "";
  if (!spec) return null;
  const due = dueDate(b);
  const span = repeatSpan(spec, due || todayISO());
  if (!span || span < 1) return null;
  let start = due ? shiftISO(due, -span) : a.added || todayISO();
  const back = holdEnded(a);
  if (back && back > start) start = back;
  return {span, rounds: Math.max(0, dateDiffDays(start, todayISO())) / span};
}
