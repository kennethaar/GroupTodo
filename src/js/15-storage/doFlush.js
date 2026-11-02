async function doFlush() {
  if (WIPING) return;
  let wrote = false, waiting = false;
  // Counted for the bar of a move being saved (trackSave).
  let sent = 0;
  const toSend = [...LOADED.values()].reduce((n, r) =>
    n + (r.hold || !r.backend ? 0 : r.dirty.size + r.removed.size), 0);
  if (toSend) jobsSaving(0, toSend);
  for (const rec of Array.from(LOADED.values())) {
    if (rec.hold) continue;          // its folder looks emptied: see looksEmptied()
    if (!rec.backend || (!rec.dirty.size && !rec.removed.size)) continue;
    let dirty = Array.from(rec.dirty); rec.dirty.clear();
    let gone  = Array.from(rec.removed); rec.removed.clear();
    // A read of this area under way may have listed the files before these went.
    for (const edited of rec.readers || []) for (const p of [...dirty, ...gone]) edited.add(p);
    // A page still loading is an empty stand-in, and must not overwrite its file.
    if (rec.stubs) {
      dirty = dirty.filter(p => !stillLoading(rec, p));
      gone  = gone.filter(p => !stillLoading(rec, p));
      if (!dirty.length && !gone.length) continue;
    }
    wrote = true;
    V.syncing = true;
    setSync("sync", "saving...");
    const merged = [], held = [], put = [];
    // The mirror goes first: after this line the work cannot be lost, whatever
    // the real backend does next.
    await writeMirror(rec, dirty);
    await markUnconfirmed(rec, dirty);
    await removeMirror(rec, gone);
    try {
      /* A name the folder will not take ("Name is not allowed") is not an
         outage: every retry fails the same way, and it used to stop the files
         after it from going up too. So it is said once, by name, and the rest
         carry on. The page stays in the mirror on this device. */
      for (const p of dirty) {
        const page = rec.pages.get(p);
        if (!page) continue;
        /* In the folder, but it would not open: what is here is not its
           contents, and writing it would put a stranger over the file (#188). */
        if (rec.backend.unread?.has(p)) {
          if (!(rec.unreadSaid || (rec.unreadSaid = new Set())).has(p)) {
            rec.unreadSaid.add(p);
            notify("\"" + p.split("/").pop() + "\" is in the folder but would not open, so it is left as it is. " +
                   "Vault & sync \u2192 More \u2192 Check the folder reads it again.", "warn");
          }
          continue;
        }
        try { if (await writePageChecked(rec, p, page, merged)) put.push(p); else held.push(p); }
        catch (e) {
          if (!(e instanceof TypeError) || !/name is not allowed/i.test(e.message || "")) throw e;
          rec.badNames = rec.badNames || new Set();
          if (!rec.badNames.has(p)) {
            rec.badNames.add(p);
            notify("\"" + p.split("/").pop() + "\" (in " + (p.split("/").slice(0, -1).join("/") || "the top folder") +
                   ") has a name the folder will not take, so it stays on this device only. " +
                   "Renaming it fixes it.", "warn");
          }
        }
        jobsSaving(++sent, toSend);
      }
      /* A file that will not go is not a detail: when a move's old file stays,
         the project is back on its old shelf at the next load. So a delete
         that fails is kept and tried again, and said, rather than swallowed.
         One already gone is what was wanted. */
      const stuck = [];
      for (const p of gone) {
        try { await rec.backend.remove(p); rec.base?.delete(p); }
        catch (e) { if (!/NotFound/i.test((e && (e.name + " " + e.message)) || "")) stuck.push([p, e]); }
        jobsSaving(++sent, toSend);
      }
      if (stuck.length) {
        stuck.forEach(([p]) => rec.removed.add(p));
        throw new Error("could not remove " + stuck.map(([p]) => p).join(", ") + " (" + (stuck[0][1].message || stuck[0][1]) + ")");
      }
      /* Held for a merge until you stop typing: still to be written, so still
         dirty, and still in the mirror. */
      held.forEach(p => rec.dirty.add(p));
      if (held.length) waiting = true;
      await confirmMirror(rec, dirty.filter(p => !held.includes(p)));
      tellSiblings(rec, put, gone);
      if (merged.length) { sayMerged(rec, merged); if (rec.name === V.space) render(); }
      V.error = null;
      if (rec.offline) {            // it came back; say so once and stop warning
        rec.offline = null;
        notify(spaceLabel(rec.name) + " is saving to its own storage again. " +
               "Everything written while it was away has gone up.");
      }
    } catch (e) {
      dirty.forEach(p => rec.dirty.add(p));
      V.error = e;
      setSync("warn", "saved on device");
      reportStorageTrouble(rec, e);
      V.syncing = false;
      jobsSaved("Done here, and kept on this device - the files go up when the folder is back.", "warn");
      retryFlush();                 // a sleeping box must not need a keystroke
      return;
    }
  }
  V.syncing = false;
  if (![...LOADED.values()].some(r => !r.hold && (r.dirty.size || r.removed.size))) jobsSaved("Saved.");
  if (heldRecords().length) setSync("warn", "not saving - folder looks empty");
  else if (V.backend) setSync("ok", V.backend.label);
  if (wrote) Spaces.writeSummary().catch(() => {});
  for (const rec of LOADED.values())
    if (!rec.hold && (rec.dirty.size || rec.removed.size)) { scheduleFlush(); break; }
  // A page waiting for a merge is looked at again in a while, not every 450 ms.
  if (waiting) { clearTimeout(flushTimer); flushTimer = setTimeout(flush, 2000); }
}
