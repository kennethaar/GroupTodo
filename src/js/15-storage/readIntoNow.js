async function readIntoNow(record, edited, files = null) {
  /* A folder or template load can finish after the journal is already on screen,
     and an area is read again behind your back each time you switch to it --
     seconds, for a big synced folder. Every page edited meanwhile is laid back
     over the loaded snapshot, and one deleted meanwhile stays deleted: a line
     typed or taken out then is never replaced by the older file. */
  if (!files) try { files = await record.backend.list(); }
  catch (e) {
    // A folder that is not there any more is the same alarm as one that is empty.
    if (!(record.backend.kind === "fs" && /NotFound/i.test((e && e.name) || ""))) throw e;
    holdRecord(record, "missing", 0);
    return record;
  }
  const seen = Array.from(files.keys())
    .filter(p => !isGuidePath(p) && !isLangPath(p) && !isPromptPath(p) && /\.md$/i.test(p) && !looksLikeBundle(files.get(p))).length;
  if (looksEmptied(record, seen)) {
    holdRecord(record, "empty", seen);
    return record;
  }
  record.hold = null;
  if (seen && (record.backend.kind === "fs" || record.backend.kind === "http"))
    PREF.set("pagecount:" + record.name, String(seen));
  for (const path of [...record.dirty, ...record.removed]) edited.add(path);
  /* The page a line is being typed into keeps what is on screen, and is
     merged with its file when the line is written back (#232). */
  const typing = typingPath(record.name);
  if (typing && record.pages.has(typing)) edited.add(typing);
  /* What was done to a stand-in while it loaded was done to an empty page:
     its file wins, and is not sent again. */
  let lost = 0;
  for (const path of Array.from(edited)) {
    if (!stillLoading(record, path)) continue;
    edited.delete(path); record.dirty.delete(path); record.removed.delete(path);
    const page = record.pages.get(path);
    if (record.stubs.has(path) && (!page || serializePage(page) !== serializePage(parsePage("")))) lost++;
  }
  const localEdits = new Map([...edited].map(path => [path, record.pages.get(path)]));
  const oldBase = record.base || new Map();
  const couriers = fillRecord(record, files, new Map(record.pages));
  // Every file is in: nothing is a stand-in any more.
  record.stubs = null; record.restError = null;
  /* Local edits win over files that completed loading later. Those still dirty
     are flushed normally to the selected backend. */
  for (const [path, page] of localEdits) {
    const fileText = files.get(path), was = oldBase.get(path);
    if (page) record.pages.set(path, page);
    else record.pages.delete(path);
    /* The edit was made to the file as it was before, so that stays what it
       is merged against: a change another device made since is kept (#220). */
    if (oldBase.has(path)) record.base.set(path, was);
    else record.base.delete(path);
    /* A page made or changed here whose file says more: today's page poured
       from its templates while the folder still waited for its permission,
       say. Kept as it was, the day showed its templates and not what was
       written in it, until a line typed and saved merged the two. So the two
       are merged now, nothing of either dropped, and the result is saved. The
       page being typed in waits for its line to be written back (#232). */
    if (!page || fileText == null || path === typing || stillLoading(record, path)) continue;
    const ours = serializePage(page);
    if (fileText === ours || fileText === was) continue;
    const m = mergePageText(path, was, fileText, ours);
    record.pages.set(path, m.page);
    record.base.set(path, fileText);        // the file is in it now: what it is saved against
    record.dirty.add(path);
  }
  lostWhileLoading(record, lost);
  ensureGuides(record, files).catch(() => {});
  langAfterLoad(record).catch(() => {});
  applyVaultCss(record);
  if (couriers) {
    notify(couriers + (couriers === 1 ? " exported vault file is" : " exported vault files are") +
           " in this folder. Left as they are - they are copies for sending, not pages. " +
           "Keeping them outside the folder avoids the confusion.", "warn");
  }
  const folded = foldSyncCopies(record);
  if (folded.length) {
    const names = folded.map(p => "\u201C" + (record.pages.get(p)?.props?.title || p.split("/").pop().replace(/\.md$/i, "")) + "\u201D");
    notify("Syncthing had left " + (folded.length === 1 ? "a conflict copy of " + names[0]
             : "conflict copies of " + names.length + " pages") +
           ". Each is merged into its page, with no line twice, and the copy deleted.");
    scheduleFlush();
  }
  const newer = await mergeMirror(record);
  if (newer) {
    notify(newer + " change(s) made on this device are being sent up now.", "warn");
    scheduleFlush();
  }
  const leftovers = dropLeftovers(record);
  if (leftovers) {
    notify(leftovers === 1 ? "The old copy of a moved project was still in its old folder. It is gone now."
                           : leftovers + " old copies of moved projects were still in their old folders. They are gone now.");
    scheduleFlush();
  }
  return record;
}
