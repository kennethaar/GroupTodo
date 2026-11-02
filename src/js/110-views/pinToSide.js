function pinToSide(space, path, branch = "") {
  space = space || V.space || "";
  const today = !branch && inSpace(space, () => path === journalPath(todayISO()));
  setSidePin({space, path, branch, today});
  SIDE_PAGE = null; SIDE_FOLLOW = false;
  HELP_SIDE = null; HELP_MARKS = false;
  $("#pagePane").scrollTop = 0;
  render();
  notify(NARROW.matches
    ? "Pinned to the right. It shows there on a wider screen."
    : branch ? "The line is pinned to the right." : "Pinned to the right. It stays while you move about.");
}
