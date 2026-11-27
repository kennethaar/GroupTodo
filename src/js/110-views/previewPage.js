function previewPage(space, path, follow = false, at = "") {
  space = space || V.space;
  if (!inSpace(space, () => V.pages.has(path))) { openPageIn(space, path); return; }
  SIDE_FOLLOW = follow;
  sideUnfoldTo(space, path, at);
  SIDE_PAGE = at ? {space, path, at} : {space, path};
  HELP_SIDE = null; HELP_MARKS = false;
  $("#pagePane").scrollTop = 0;
  drawSidePage();
  helpMarksDraw();
}
