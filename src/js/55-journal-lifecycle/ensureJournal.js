/* ============================================================
   55_JOURNAL_LIFECYCLE
   Port of: init.lua 45_JOURNAL_LIFECYCLE
   ============================================================ */
function ensureJournal(date) {
  date = date || todayISO();
  const path = journalPath(date);
  if (V.pages.has(path)) return path;
  const tpls = resolveTemplates({date, kind: "journals"});
  const page = tpls.length ? pourDayTemplates(date, tpls) : pageFromTemplate("journals",date,{date});
  hoistDayTrackers(page);
  putPage(path, page);
  return path;
}
