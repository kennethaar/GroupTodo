/* #23 one rule for "no next action": the stuck list's. A task on a day page
   that links the project, or a coming meeting about it, moves it along too. */
function isStuckProject(path, space = V.space) {
  return inSpace(space, () => memo("stuck:" + V.space,
    () => new Set(stuckActiveProjects().map(s => s.path))).has(path));
}
