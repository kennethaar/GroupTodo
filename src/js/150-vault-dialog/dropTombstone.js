/* Undoing a delete has to lift the headstone too, or the next sync would
   dutifully delete the page again on every other device. */
function dropTombstone(path) {
  const t = tombstones();
  if (!t.delete(path)) return false;
  writeTombstones(t);
  return true;
}
