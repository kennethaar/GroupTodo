/* ---------- a folder that comes back empty ----------
   An area that had pages and now opens to none has almost never been emptied
   on purpose. OneDrive has not finished downloading, the drive is not mounted,
   the folder was moved or renamed. Carrying on as usual is the worst answer:
   the app seeds templates and today's journal, writes them into the empty
   folder, and from then on it looks like a real vault that lost everything.

   So the area is put on hold. Nothing is written to that folder until you
   say what happened, and pages already in memory stay on screen. The count
   is per device, the one thing that knows what "last time" looked like. */
function looksEmptied(record, seen, key = "pagecount:" + record.name) {
  const kind = record.backend && record.backend.kind;
  if (kind !== "fs" && kind !== "http") return false;
  const had = Number(PREF.get(key, "0")) || 0;
  if (had < 3) return false;
  return seen === 0 || (had >= 20 && seen < had / 5);
}
