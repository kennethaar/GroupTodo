/* Shown again: a save by another window this one did not hear of means its
   pages are read again. Browser storage only -- a whole folder is the
   folder's own check. */
async function catchUpWithSiblings() {
  for (const rec of LOADED.values()) {
    if (!rec.backend || !["idb", "ls"].includes(rec.backend.kind) || READING.size) continue;
    let stamp = null;
    try { stamp = JSON.parse(localStorage.getItem(siblingStampKey(rec.name)) || "null"); } catch (_) {}
    if (!stamp || stamp.by === WINDOW_ID || !(stamp.at > (SIBLING_SEEN.get(rec.name) || 0))) continue;
    SIBLING_SEEN.set(rec.name, stamp.at);
    await takeSiblingSaves(rec, null).catch(() => {});
  }
}
