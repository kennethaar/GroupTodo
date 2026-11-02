/* Load a space's files without making it the active one. */
/* Rename things an older vault still spells the old way. Cheap, idempotent,
   and it keeps links working rather than leaving dangling [[k/...]] behind. */
function migrateVault() {
  let moved = 0;
  const legacyLists = join(PAGES, "k");
  for (const path of Array.from(V.pages.keys())) {
    if (!path.startsWith(legacyLists + "/")) continue;
    const target = join(DIRS.lists, path.slice(legacyLists.length + 1));
    if (!V.pages.has(target)) {
      putPage(target, getPage(path));
      removePage(path);
      moved++;
    }
  }
  if (moved) {
    rewriteChecklistLinks();
    notify("Moved " + moved + " checklist(s) to pages/8/.");
  }
  migrateHorizons();
  migrateCancelled();
  migrateJournals();
  migrateTemplates();
  dropOldCalSkips();
  return moved;
}
