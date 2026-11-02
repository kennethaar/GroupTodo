/* Move both ends by the same number of days, writing only the properties the
   task already had -- plus a SCHEDULED:: when the bar's start was coming from
   Added::, because that is the one case where there is nothing to shift. */
function shiftTaskBy(path, b, days) {
  if (!days || !canMoveTask(b)) return false;
  const span = spanOf(b, isJournalPath(path) ? journalDate(path) : null);
  if (!span) return false;
  writeDay(b, "SCHEDULED", shiftISO(span.start, days));
  if (dateIn(blockProp(b, "DEADLINE"))) writeDay(b, "DEADLINE", shiftISO(span.end, days));
  return true;
}
