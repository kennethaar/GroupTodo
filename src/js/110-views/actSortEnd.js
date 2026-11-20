/* Every sequence asked: the ones still standing on their own go at once.
   A step that now waits behind another leaves the hand; the very next
   actions stay. */
function actSortEnd(r) {
  if (actSortRoots(r).length >= 3) inS(r, () => {
    const page = getPage(r.path);
    if (page) { page.props.parallel = "yes"; touch(r.path); }
  });
  ACT_SORT = null;
  clearMemo();
  if (SOL.order) {
    const at = SOL.order[SOL.i];
    SOL.order = SOL.order.filter(x => x.path !== r.path || x.space !== r.space || x.block.state === "DOING" || !hasOpenDescendant(x.block));
    const i = SOL.order.indexOf(at);
    if (i >= 0) SOL.i = i;
  }
}
