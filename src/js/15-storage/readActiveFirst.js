/* The active projects, right after the day and before the folder is listed:
   pages/1/ alone is listed, each project is shown by its file name, then its
   lines are read in and shown. Listing the whole folder of a phone took half
   a minute, with no project on screen meanwhile (#181). What is read here
   joins got, so the listing does not read it again. */
async function readActiveFirst(record, edited, got, onDay) {
  let t = performance.now();
  let paths = [];
  try { paths = (await record.backend.namesIn(DIRS.active)).filter(p => !got.has(p) && !record.pages.has(p)); }
  catch (_) { return; }
  if (!paths.length) { record.activeIn = true; return; }   // enough for the widgets (#474)
  for (const p of paths) {
    const page = parsePage("");
    STUB_PAGES.add(page);
    record.pages.set(p, page);
    record.stubs.add(p);
  }
  loadStep(record.name, "active projects listed", t, paths.length + " shown by name");
  if (onDay) onDay(record);
  t = performance.now();
  let files = new Map();
  try { files = await record.backend.readMany(paths); } catch (_) {}
  let lost = 0;
  for (const [p, text] of files) {
    if (!record.stubs.has(p)) continue;
    const page = record.pages.get(p);
    if (edited.has(p) || record.dirty.has(p) || record.removed.has(p)) {
      // What was done to a stand-in was done to an empty page: its file wins.
      if (!page || serializePage(page) !== serializePage(parsePage(""))) lost++;
      edited.delete(p); record.dirty.delete(p); record.removed.delete(p);
    }
    record.stubs.delete(p);
    const fresh = parsePage(text);
    PAGE_SRC.set(fresh, text);
    record.pages.set(p, fresh);
    noteBase(record, p, text);
    got.set(p, text);
  }
  lostWhileLoading(record, lost);
  record.activeIn = true;       // enough for the widgets, long before the whole folder (#474)
  loadStep(record.name, "active projects read", t, "read " + files.size + " of " + paths.length);
  if (onDay) onDay(record);
}
