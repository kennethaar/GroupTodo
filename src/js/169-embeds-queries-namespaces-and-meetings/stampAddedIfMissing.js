/* ---------- "Added" on a task ----------
   A task made anywhere but a day page has no date in its file name, so the
   day it became a task is written on it, the way the Neovim config did. The
   todo template usually says so already; this covers the rest -- a template
   without it, a line read in with values of its own, a note made a task
   again. A task already dated keeps its date. Nor on a checklist or a
   template in 8/: what is written there is poured into every run of it, and
   the day it was written would go along into all of them. */
function stampAddedIfMissing(path, b) {
  if (!b || !OPEN_STATES[b.state] || !path || isJournalPath(path) || path.startsWith(DIRS.lists + "/")) return false;
  if (trim(blockProp(b, "Added") || "")) return false;
  setBlockProp(b, "Added", "[[" + todayISO() + "]]");
  return true;
}
