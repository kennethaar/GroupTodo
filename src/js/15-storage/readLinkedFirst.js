/* Opened by a link: its page alone, read by name and drawn before anything
   else. Finding today's file and the settings took 6 of 12 seconds on a
   phone, and one file read alone takes about 2 (#474). Nothing else is known
   yet, so nothing is saved until the folder is listed (record.later). The
   files read, empty when there is no link or its page is not there. */
async function readLinkedFirst(record, linked, onDay) {
  if (!linked.length || !onDay) return new Map();
  const t = performance.now();
  let got = new Map();
  try { got = await record.backend.readDays([], {files: linked}); } catch (_) {}
  if (!got.size) return got;
  fillRecord(record, got);
  record.hold = null;
  record.stubs = new Set();
  record.later = p => !got.has(p);
  record.dayOnly = true;
  loadStep(record.name, "linked page read first", t, [...got.keys()].join(", "));
  onDay(record);
  return got;
}
