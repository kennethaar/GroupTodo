/* Read the folder again. What was made while it was on hold and never edited
   by you -- seeded templates, an empty journal -- is dropped first, or it
   would be laid over the real files that just came back. */
async function retryHold(name) {
  const rec = LOADED.get(name);
  if (!rec || !rec.hold) return;
  const since = rec.hold.at;
  for (const p of Array.from(rec.dirty)) {
    const page = rec.pages.get(p);
    if (!page || !(page.props?.updated >= since)) { rec.dirty.delete(p); rec.pages.delete(p); }
  }
  rec.removed.clear();
  try { await readInto(rec); }
  catch (e) { notify("Could not read the folder: " + storageReason(e) + ".", "warn"); }
  if (rec.hold) { showHoldDialog(name); notify("Still nothing there.", "warn"); return; }
  afterHold(name);
  notify(spaceLabel(name) + " is back: " + rec.pages.size + " pages.");
}
