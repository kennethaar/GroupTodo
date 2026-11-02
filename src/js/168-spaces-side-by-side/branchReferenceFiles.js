/* A branch carries the pages it links to along, but never a journal page and
   never one the target space already has. */
function branchReferenceFiles(path, space) {
  return inSpace(space, () => !isJournalPath(path) && V.pages.has(path) ? [path] : []);
}
