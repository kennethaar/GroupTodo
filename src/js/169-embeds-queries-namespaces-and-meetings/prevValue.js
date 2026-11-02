/* The newest value before the day page at `path`, or null. */
function prevValue(path, key) {
  const day = dayOfPath(path);
  if (!day) return null;
  const list = prevValueIndex().get((journalOwnerOf(path) || "").toLowerCase())?.get(key);
  if (!list) return null;
  for (let i = list.length - 1; i >= 0; i--) if (list[i].date < day) return list[i];
  return null;
}
