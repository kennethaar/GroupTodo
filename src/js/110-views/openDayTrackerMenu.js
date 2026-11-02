/* What you can do to one tracker on a day: the Trackers page's buttons, in reach where it is filled in. */
function openDayTrackerMenu(path, key, move) {
  const t = parseTracker(key + "::");
  if (!t) return;
  chipMenu(trackerTitle(t.name), "on " + humanDate(dayOfPath(path)), lettered([
    ["When it comes round", "the days it is on", () => openTrackerWhen(t.name, t.key)],
    ["Its page", "icon, colour, chart and notes", () => openTrackerPage(t.name)],
    ["Rename", "the history comes along", () => renameTrackerPrompt(t.name)],
    move ? ["Move to another area", null, () => openMoveTracker(t.name, move, dayOfPath(path))] : null,
    ["Remove from this day", "the other days keep it", () => removeDayTracker(path, key)],
    ["Stop tracking", "no new days get it", () => stopTrackerPrompt(t.name)],
  ]));
}
