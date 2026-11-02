/* Is this project part of a chain, and which end? Asked in its own area. */
function chainTerms(projectPath, space) {
  if (!projectPath) return {blocked: false, blocking: false};
  return inSpace(space, () => ({
    blocked: blockersOf(projectPath).length > 0,
    blocking: dependentsOf(projectPath).some(p => !projectCleared(p)),
  }));
}
