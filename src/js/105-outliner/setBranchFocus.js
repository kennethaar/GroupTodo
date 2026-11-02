function setBranchFocus(page, id, path) {
  navRecord();
  if (FOCUSED && FOCUSED.page !== page) BRANCH_FOCUS.delete(FOCUSED.page);
  const trail = id ? branchTrail(page.blocks, id) : null;
  if (trail) {
    BRANCH_FOCUS.set(page, id);
    FOCUSED = {page, path: path || (FOCUSED && FOCUSED.page === page ? FOCUSED.path : null), space: V.space};
    trail[trail.length - 1].collapsed = false;
  } else {
    BRANCH_FOCUS.delete(page);
    if (FOCUSED && FOCUSED.page === page) FOCUSED = null;
  }
  lineSelClear(false);
  render();
  $("#content").scrollTop = 0;
  navRecord();
}
