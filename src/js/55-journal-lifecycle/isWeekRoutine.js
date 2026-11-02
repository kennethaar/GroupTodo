function isWeekRoutine(b) {
  if (EVERY_WEEK_RE.test(b.title || "")) return true;
  const r = parseRule(repeatOf(b));
  return !!r && r.freq === "week" && r.n === 1;
}
