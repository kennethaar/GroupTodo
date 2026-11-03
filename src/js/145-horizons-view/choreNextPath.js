function choreNextPath(block, when) {
  if (!isChoreBlock(block) || !when) return null;
  return choreRepeatOnWeek(repeatOf(block)) ? ensureWeek(weekOf(when)) : ensureJournal(when);
}
