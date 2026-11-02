/* Dragging the left edge is "start it later", which is SCHEDULED:: and nothing
   else. Dragging the right edge is "it has to be finished by", which is a
   DEADLINE:: -- and a task that had no deadline before now has one, which is
   the honest reading of somebody pulling its end to a date. */
function setTaskStart(path, b, iso) {
  if (!canMoveTask(b)) return false;
  const span = spanOf(b, isJournalPath(path) ? journalDate(path) : null);
  if (!span) return false;
  /* Only a real deadline is an end to clamp a start against. For an open task
     without one, spanOf's "end" is today standing in for "still running", so
     clamping against it silently refused to schedule anything for next week --
     which is most tasks, and the most ordinary thing to want. */
  const hardEnd = dateIn(blockProp(b, "DEADLINE"));
  if (hardEnd && iso > hardEnd) iso = hardEnd;
  writeDay(b, "SCHEDULED", iso);
  return true;
}
