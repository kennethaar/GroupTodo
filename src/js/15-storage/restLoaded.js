/* The second half of a big folder is in: what ran on the first half runs
   again over the whole, and the screen catches up. */
function restLoaded(rec) {
  if (LOADED.has(rec.name) && LOADED.get(rec.name) !== rec) return;   // read from storage since replaced (#232)
  if (rec.hold) { showHoldDialog(rec.name); setSync("warn", "not saving - folder looks empty"); return; }
  if (!LOADED.has(rec.name)) return;
  inSpace(rec.name, () => migrateVault());
  // The template pass skipped the stand-ins; the pages are here now.
  inSpace(rec.name, () => scheduleTemplateRefresh());
  reconcileSyncedPages(rec.name);
  if (V.space === rec.name) bindActive(rec.name);
  clearMemo();
  scanVerbs();
  if (rec.dirty.size || rec.removed.size) scheduleFlush();
  renderUnlessTyping();
}
