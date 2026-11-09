/* Shown again: a sync app such as Syncthing may have brought another
   device's edits into the folder meanwhile. A folder is read whole only when
   the area loads -- many minutes on a phone -- so today's page and the page
   that is open are read again on their own, one or two files (#341). A page
   with unsaved work here is left, and goes up merged with the file. Only
   pages the folder is known to have are asked for: one not written yet is
   no file that went. */
async function catchUpWithFolder() {
  const rec = LOADED.get(V.space);
  const b = rec && rec.backend;
  if (!b || b.kind !== "fs" || !rec.base || FOLDER_READING.has(rec.name)) return 0;
  const paths = [journalPath(todayISO())];
  if (state.view === "page" && state.pagePath) paths.push(state.pagePath);
  return takeSiblingSaves(rec, [...new Set(paths)].filter(p => rec.base.has(p)));
}
