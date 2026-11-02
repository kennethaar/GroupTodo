/* "Allow access" on a phone: listing a big folder there can take minutes, and
   one file a sync app has not brought down may never open. Read before the
   screen was drawn, the area sat on "Opening area..." all that time, so the
   copy from browser storage stays on screen, and the folder is read into a
   fresh record behind it, today first. No day page is made from the copy
   meanwhile (folderWaiting). Once today is in, the folder's record takes
   over; anything done to the copy meanwhile was saved to browser storage and
   is merged into the folder's pages, line by line (mergeMirror). */
function readFolderBehind(held, backend) {
  const name = held.name, rec = newRecord(name, backend);
  FOLDER_READING.add(name);
  setSync("sync", "reading the folder...");
  readInto(rec, {stage: true, onRest: restLoaded, onSoon: soonLoaded}).then(async () => {
    if (LOADED.get(name) !== held) { FOLDER_READING.delete(name); return; }   // opened again or removed meanwhile
    await flush();                                   // what was done to the copy, into browser storage
    LOADED.set(name, rec);
    FOLDER_READING.delete(name);
    await mergeMirror(rec);
    reconcileSyncedPages(name);
    if (V.space === name) bindActive(name);
    if (rec.hold) { showHoldDialog(name); setSync("warn", "not saving - folder looks empty"); }
    else {
      inSpace(name, () => { migrateVault(); ensureJournal(todayISO()); });
      if (V.space === name) setSync("ok", backend.label);
    }
    if (rec.dirty.size || rec.removed.size) scheduleFlush();
    clearMemo(); scanVerbs();
    renderUnlessTyping();
  }).catch(e => {
    FOLDER_READING.delete(name);
    reportStorageTrouble(rec, e);
    /* The browser copy is no folder: ask for the folder again, so "Allow
       access" can try once more, rather than leave the area on browser
       storage with nothing to say so. */
    if (backend.handle && LOADED.get(name) === held) PENDING_GRANT.set(name, backend.handle);
    setSync("warn", "folder not read");
    renderUnlessTyping();
  });
}
