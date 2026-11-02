function colDraggable(col, by, key) {
  const head = col.querySelector(".bcol-head");
  col.dataset.colkey = key;
  head.draggable = true;
  const unmark = () => col.classList.remove("colbefore", "colafter");
  const after = e => { const r = col.getBoundingClientRect(); return e.clientX > r.left + r.width / 2; };
  head.addEventListener("dragstart", e => {
    COL_DRAG = {by, key};
    DRAGGED = null;
    col.classList.add("coldrag");
    try {
      e.dataTransfer.setData("text/plain", key);
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setDragImage(col, e.offsetX, e.offsetY);
    } catch (_) {}
  });
  head.addEventListener("dragend", () => {
    COL_DRAG = null;
    col.classList.remove("coldrag");
    $$(".bcol.colbefore, .bcol.colafter").forEach(c => c.classList.remove("colbefore", "colafter"));
  });
  col.addEventListener("dragover", e => {
    if (!COL_DRAG || COL_DRAG.by !== by || COL_DRAG.key === key) return;
    e.preventDefault();
    const a = after(e);
    col.classList.toggle("colafter", a);
    col.classList.toggle("colbefore", !a);
  });
  col.addEventListener("dragleave", e => { if (!col.contains(e.relatedTarget)) unmark(); });
  col.addEventListener("drop", e => {
    unmark();
    if (!COL_DRAG || COL_DRAG.by !== by) return;
    e.preventDefault();
    const moving = COL_DRAG.key;
    COL_DRAG = null;
    if (moving === key) return;
    const shown = $$(":scope > .bcol[data-colkey]", col.parentElement).map(c => c.dataset.colkey).filter(k => k !== moving);
    shown.splice(shown.indexOf(key) + (after(e) ? 1 : 0), 0, moving);
    // The hidden columns keep their place, next to the ones they stood beside.
    const prev = PREF.get(colOrderKey(by), "[]");
    PREF.set(colOrderKey(by), JSON.stringify(mergeColOrder(shown, colOrder(by))));
    render();
    pushUndo({run: () => { PREF.set(colOrderKey(by), prev); render(); notify("Column put back."); return true; }});
  });
  return col;
}
