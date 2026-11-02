function nudgeQuiet(id) {
  const until = nudgeQuietUntil(id);
  return !!until && todayISO() < until;
}
