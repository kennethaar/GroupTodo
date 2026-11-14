/* Today's page, then yesterday's, read by name before the folder is listed,
   and each drawn as soon as it is in (onDay). A phone took minutes to list a
   big folder before the day could show (#181). Yesterday's is for what was
   written before midnight. The settings come with today's page, and on a new
   day, with no page of yours yet, so do the day templates it is made from.
   Nothing else is known yet: a page made now waits for the listing before it
   is saved (doFlush), as the folder may have it. Null when there is nothing
   to show yet: then the folder is listed and read as before. */
async function readDayFirst(record, edited, today, onDay) {
  const who = "“" + record.name + "”: ";
  let t = loadMark(who + "reading today's page by name");
  let got;
  try { got = await record.backend.readDays([today], {files: [SETTINGS_PATH]}); }
  catch (_) { return null; }
  const mine = new Set(["", slugPerson(whoAmI()), ...myNames().map(slugPerson)]);
  if (![...got.keys()].some(p => isJournalPath(p) && mine.has(journalOwnerOf(p)))) {
    try { for (const [p, text] of await record.backend.readDays([], {dirs: [DIRS.lists]})) got.set(p, text); }
    catch (_) {}
  }
  if (!got.size) return null;
  fillRecord(record, got);
  record.hold = null;
  record.stubs = new Set();
  record.later = p => !got.has(p);
  record.dayOnly = true;
  loadMark(who + "read " + got.size + " files first (today's page, before the folder is listed)", t);
  if (onDay) onDay(record);
  t = performance.now();
  let y = new Map();
  try { y = await record.backend.readDays([shiftISO(today, -1)]); } catch (_) {}
  for (const [p, text] of y) {
    if (record.pages.has(p) || edited.has(p) || record.dirty.has(p)) continue;
    const page = parsePage(text);
    PAGE_SRC.set(page, text);
    record.pages.set(p, page);
    noteBase(record, p, text);
    got.set(p, text);
  }
  loadMark(who + "read yesterday's page", t);
  if (onDay && y.size) onDay(record);
  return {files: got};
}
