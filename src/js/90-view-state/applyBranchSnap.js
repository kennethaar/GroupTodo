/* Put a remembered focus back, or let go of the current one. */
function applyBranchSnap(branch) {
  if (FOCUSED) { BRANCH_FOCUS.delete(FOCUSED.page); FOCUSED = null; }
  if (!branch) return;
  const [space, path, id] = branch.split("\u0000");
  inSpace(space, () => {
    const page = getPage(path);
    if (!page) return;
    BRANCH_FOCUS.set(page, id);
    FOCUSED = {page, path, space};
  });
}
