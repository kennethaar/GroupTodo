/* After a redraw the boxes are new elements: put the zoom back on them. */
function solRestore() {
  if (SOL_DRAG && SOL_DRAG.ghost) {
    const d = SOL_DRAG, box = solBox(d.k);
    // The card left on the mat is a new one too: it stays dimmed while it is in your hand.
    const home = solCardEl();
    if (home) { home.classList.add("dragging"); d.card = home; }
    /* Zoom and reach down first, then grow from the same spot as before the
       redraw, so nothing on screen moves; then find the pill under the pointer. */
    solPaint(d.k, null, {quiet: true, typing: true});
    if (box && solZoomOn() && d.at && d.ak === d.k) { const b = solBase(box); solOrigin(box, d.at[2] / b.width, d.at[3] / b.height); }
    else if (box && solZoomOn()) d.at = solAnchor(box, d.x, d.y);
    d.pill = box ? solNearestPill(box, d.x, d.y) : null;
    solPaint(d.k, d.pill, {quiet: true, typing: true});
    if (d.pill) solArrow(solCardEl() || d.ghost, d.pill, solPillWord(box, d.pill));
    return;
  }
  if (SOL_KB) {
    const box = solBox(SOL_KB.k);
    if (!box) { SOL_KB = null; solUnpaint(); return; }
    solOrigin(box, +box.dataset.dox, +box.dataset.doy);
    const pills = solPills(box);
    SOL_KB.i = Math.min(SOL_KB.i, pills.length - 1);
    solKbShow(true);
  }
}
