function closeSidePage() {
  SIDE_FOLLOW = false;
  // Clarify's day page, put away: it stays away until asked for (#376).
  if (SIDE_PAGE && SIDE_PAGE.at) CL.noSide = true;
  SIDE_PAGE = null;
  hideSidePane();
  if (sidePin()) drawSidePage();
}
