/* How much is open in a project, counted the way its card counts it -- the
   tasks on the page, plus the ones written in a day page under a link to it.
   Memoised, because the bar counts every project and then each column counts
   its own again. */
function projOpenCount(r) {
  return memo("projOpen:" + (r.space || "") + "|" + r.path, () => inSpace(r.space, () =>
    openTodoCount(r.path) + journalActionsFor(r.path).filter(x => OPEN_STATES[x.state]).length));
}
