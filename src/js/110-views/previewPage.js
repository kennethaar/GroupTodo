function previewPage(space, path, follow = false) {
  space = space || V.space;
  if (!inSpace(space, () => V.pages.has(path))) { openPageIn(space, path); return; }
  SIDE_FOLLOW = follow;
  SIDE_PAGE = {space, path};
  HELP_SIDE = null; HELP_MARKS = false;
  $("#pagePane").scrollTop = 0;
  drawSidePage();
  helpMarksDraw();
}
