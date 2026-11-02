/* The project a line belongs to: the page it is on, if that is a project, or
   the project it (or the nearest bullet above it) links to. */
function projectOfBlock(path, block) {
  if (pageKind(path) === "project") return path;
  const linked = nearestProjectAncestor(block);
  const tp = linked && findExistingPage(linked.ref);
  return tp && pageKind(tp) === "project" ? tp : null;
}
