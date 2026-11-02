function closeSidePage() {
  SIDE_FOLLOW = false;
  SIDE_PAGE = null;
  hideSidePane();
  if (sidePin()) drawSidePage();
}
