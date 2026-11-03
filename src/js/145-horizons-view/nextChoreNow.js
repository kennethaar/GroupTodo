/* The next one put in straight away, for whoever's turn it is, or for the
   same person again when nobody's turn can be told. */
function nextChoreNow(path, block) {
  const when = nextRepeatDate(repeatOf(block), dueDate(block) || todayISO());
  if (!when) return null;
  const who = whoseTurn(block);
  const copy = makeNextOccurrence(path, block, when);
  if (!copy) return null;
  if (who) assignBlock(pathOfBlock(copy, path), copy, who);
  return {copy, when, who};
}
