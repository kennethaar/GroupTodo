/* An area's row on the Horizons ladder takes a responsibility dragged from
   another area. The move asks first, and offers the responsibility's
   projects along, ticked. */
function respDropTarget(row, target) {
  const takes = d => {
    const items = boardPageItems(d);
    return !!items && items.some(x => x.space !== target && pageKind(x.path) === "area");
  };
  row.addEventListener("dragover", e => {
    if (!takes(DRAGGED)) return;
    e.preventDefault();
    try { e.dataTransfer.dropEffect = "move"; } catch (_) {}
    row.classList.add("over");
  });
  row.addEventListener("dragleave", e => { if (!row.contains(e.relatedTarget)) row.classList.remove("over"); });
  row.addEventListener("drop", e => {
    e.preventDefault();
    row.classList.remove("over");
    const d = DRAGGED;
    DRAGGED = null;
    if (!takes(d)) return;
    const list = boardPageItems(d)
      .filter(x => x.space !== target && pageKind(x.path) === "area")
      .map(x => ({path: x.path, from: x.space}));
    dropPagesOnSpace(list, target, {mode: "move"});
  });
  return row;
}
