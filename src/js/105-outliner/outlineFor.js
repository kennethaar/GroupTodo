/* A day page opened on its own shows that day in every visible space, side by
   side; anywhere else a page is just its own outline, the pane at the right
   included, where there is no room for columns. */
function outlineFor(path, opts = {}) {
  const day = !SIDE_DRAWING && state.view === "page" && isJournalPath(path) && /\d{4}-\d{2}-\d{2}/.exec(path);
  return day ? spaceJournalColumns(day[0]) : pageOutline(path, opts);
}
