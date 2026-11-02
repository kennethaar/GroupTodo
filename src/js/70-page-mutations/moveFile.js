function moveFile(oldPath, newPath) {
  if (oldPath === newPath) return true;
  const page = getPage(oldPath);
  if (!page) { notify("The source page no longer exists.", "warn"); return false; }
  if (!V.pages.has(newPath)) trackSave("Moving " + pageTitle(oldPath), oldPath);
  const spellings = spellingsOf(oldPath);
  let result = true;
  // The same project on both sides is a merge, not a collision.
  if (V.pages.has(newPath)) result = mergePageInto(oldPath, newPath, {links: false});
  else {
    V.pages.delete(oldPath);
    V.dirty.delete(oldPath);
    V.removed.add(oldPath);
    /* The old path is gone as surely as a deleted page is: without the
       headstone, the next sync with the vault file found the page missing
       here and put the old copy back -- a project set to cancelled stood on
       the active shelf again after a reload. */
    addTombstone(oldPath);
    dropTombstone(newPath);
    putPage(newPath, page);
  }
  if (!result) return result;
  const newRef = pageRef(newPath);
  let n = 0;
  for (const old of spellings) n += rewriteLinksEverywhere(old, newRef);
  if (n) notify("Link update: " + n + " pages updated.");
  // Back, forward and the screen you are on still mean the page you moved.
  for (const snap of NAV_HIST) if (snap.space === Spaces.active && snap.pagePath === oldPath) snap.pagePath = newPath;
  if (state.pagePath === oldPath) state.pagePath = newPath;
  if (SIDE_PAGE && SIDE_PAGE.path === oldPath) SIDE_PAGE.path = newPath;
  { const p = sidePin(); if (p && p.path === oldPath && (p.space || "") === (V.space || "")) setSidePin({...p, path: newPath}); }
  movePin(oldPath, newPath);
  if (state.graphFocus === (V.space || "") + "\u0000" + oldPath) state.graphFocus = (V.space || "") + "\u0000" + newPath;
  clearMemo();
  return result;
}
