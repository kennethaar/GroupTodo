/* A prerequisite is cleared when it has no open task left, or when it has been
   filed as completed or cancelled. 2/ -- someday -- is NOT cleared: a project
   waiting on something nobody intends to start is exactly what you want told. */
function projectCleared(path) {
  const code = statusDirOf(path);
  if (code === "0" || code === "-") return true;
  const page = getPage(path);
  if (!page) return true;
  return !flattenBlocks(page.blocks).some(b => OPEN_STATES[b.state] && !isMessage(b));
}
