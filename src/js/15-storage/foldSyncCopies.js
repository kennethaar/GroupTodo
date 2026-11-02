/* Called once a read has every file in: each copy into its page, which then
   goes to be saved, and the copy to be deleted. A copy whose page is gone is
   the page now. Doing it twice changes nothing, so a copy the folder would
   not let go of yet is harmless at the next read. */
function foldSyncCopies(record) {
  const done = [];
  const copies = [...(record.copies || new Map())].sort(([a], [b]) => a.localeCompare(b));
  record.copies = new Map();
  for (const [copy, text] of copies) {
    if (looksLikeBundle(text)) continue;
    const path = syncCopyOf(copy);
    const ours = record.pages.get(path);
    record.pages.set(path, ours ? mergeSyncCopy(path, ours, parsePage(text)) : parsePage(text));
    record.removed.delete(path);
    record.dirty.add(path);
    record.removed.add(copy);
    if (!done.includes(path)) done.push(path);
  }
  return done;
}
