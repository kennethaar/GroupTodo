/* ---------- the chain, applied to the chart ----------
   A project that starts before the thing it waits on has finished is the whole
   reason to record the order, so it is drawn rather than described: the gate
   marker sits where the prerequisite ends, and the part of the bar standing
   to the left of it is hatched. */
function chainTrouble(path) {
  const need = earliestStart(path);
  const start = projectStart(path);
  if (!need || !start || start >= need) return null;
  return {need, start, days: dateDiffDays(start, need)};
}
