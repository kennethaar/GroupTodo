/* Keep where you are, and the line you are on, in the area's GTD.md as
   last:: (#492), so another device can go on there. Soon after, unless
   `now`; never while the Journal still offers the place from before. */
function lastPlaceSave(now = false) {
  clearTimeout(LAST_PLACE_TIMER);
  if (!now) { LAST_PLACE_TIMER = setTimeout(() => lastPlaceSave(true), LAST_PLACE_EVERY); return; }
  if (LAST_PLACE_OFFER !== null || typeof INIT_DONE === "undefined" || !INIT_DONE) return;
  const name = Spaces.active;
  if (!name || folderWaiting(name)) return;
  const snap = navSnapshot(), place = {};
  for (const k of NAV_FIELDS) if (snap[k] != null && snap[k] !== "") place[k] = snap[k];
  const line = document.activeElement?.closest?.("#content .blk")?.dataset.id || "";
  const key = name + JSON.stringify([place, line]);
  if (key === LAST_PLACE_SAVED) return;
  LAST_PLACE_SAVED = key;
  setSetting("last", JSON.stringify({at: new Date().toISOString(), from: deviceKind(), space: name, place, line}));
}
