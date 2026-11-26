/* The card now on the review table, shown beside it when an earlier card's
   page was opened there (#177). */
function sideFollow(space, path, at = "") {
  if (!SIDE_FOLLOW) return;
  space = space || V.space;
  const same = SIDE_PAGE && SIDE_PAGE.space === space && SIDE_PAGE.path === path;
  if (same && (SIDE_PAGE.at || "") === at) return;
  if (!inSpace(space, () => V.pages.has(path))) return;
  // At the card's line, marked, as in Clarify.
  sideUnfoldTo(space, path, at);
  SIDE_PAGE = {space, path, at};
  if (!same) $("#pagePane").scrollTop = 0;
}
