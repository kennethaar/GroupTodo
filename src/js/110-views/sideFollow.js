/* The card now on the review table, shown beside it when an earlier card's
   page was opened there (#177). */
function sideFollow(space, path) {
  if (!SIDE_FOLLOW) return;
  space = space || V.space;
  if (SIDE_PAGE && SIDE_PAGE.space === space && SIDE_PAGE.path === path) return;
  if (!inSpace(space, () => V.pages.has(path))) return;
  SIDE_PAGE = {space, path};
  $("#pagePane").scrollTop = 0;
}
