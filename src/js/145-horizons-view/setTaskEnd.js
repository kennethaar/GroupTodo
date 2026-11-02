function setTaskEnd(path, b, iso) {
  if (!canMoveTask(b)) return false;
  const span = spanOf(b, isJournalPath(path) ? journalDate(path) : null);
  if (!span) return false;
  if (iso < span.start) iso = span.start;
  // An end date on a task whose start was only ever implied would make the bar
  // jump the moment it is redrawn, so pin the start it is being stretched from.
  if (!dateIn(blockProp(b, "SCHEDULED"))) writeDay(b, "SCHEDULED", span.start);
  writeDay(b, "DEADLINE", iso);
  return true;
}
