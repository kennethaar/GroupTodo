/* A job that ends when everything changed has been written. A batch of moves
   is one job: the first starts it, the rest join it. key says which page the
   label is about, so a move that turns into a merge does not count as two. */
function trackSave(label, key) {
  for (const j of JOBS) if (j.untilSaved) {
    if (j.key !== key) { j.key = key; j.retitle("Moving pages"); }
    return j;
  }
  const j = startJob(label);
  Object.assign(j, {untilSaved: true, key});
  // Not after the usual pause: it runs once the move in hand has finished.
  clearTimeout(flushTimer);
  flush();
  return j;
}
