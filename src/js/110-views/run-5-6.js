/* ---------- dragging the card ----------
   Pointer events rather than drag-and-drop, so a finger on a phone works the
   same as a mouse. The card follows the pointer at 0.85x and 80% opacity, and
   the enlarged box sits above it, so it never hides the pill underneath. */
document.addEventListener("pointerdown", e => {
  const card = e.target.closest && e.target.closest("[data-sol-drag]");
  if (!card || e.button > 0 || e.target.closest("button,input,a") || SOL.moving) return;
  SOL_KB = null; solUnpaint();
  SOL_DRAG = {card, sx: e.clientX, sy: e.clientY, x: e.clientX, y: e.clientY, vx: 0, vy: 0,
    ghost: null, k: null, pill: null, moreT: null};
});
document.addEventListener("pointermove", e => {
  const d = SOL_DRAG;
  if (!d) return;
  const dx = e.clientX - d.sx, dy = e.clientY - d.sy;
  if (!d.ghost) {
    if (Math.hypot(dx, dy) < 6) return;
    const r = d.card.getBoundingClientRect();
    d.ghost = d.card.cloneNode(true);
    d.ghost.classList.add("solghost");
    Object.assign(d.ghost.style, {left: r.left + "px", top: r.top + "px", width: r.width + "px", height: r.height + "px",
      transformOrigin: (d.sx - r.left) + "px " + (d.sy - r.top) + "px"});
    document.body.append(d.ghost);
    d.card.classList.add("dragging");
  }
  d.vx = d.vx * 0.6 + (e.clientX - d.x) * 0.4; d.vy = d.vy * 0.6 + (e.clientY - d.y) * 0.4;
  d.x = e.clientX; d.y = e.clientY;
  d.ghost.style.transform = "translate(" + dx + "px," + dy + "px) scale(.85)";
  const box = solTargetBox(d.x, d.y, d.vx, d.vy, solBox(d.k));
  const k = box ? box.dataset.k : null;
  const pill = box && solInside(box.getBoundingClientRect(), d.x, d.y) ? solNearestPill(box, d.x, d.y) : null;
  if (k !== d.k || pill !== d.pill) {
    clearTimeout(d.moreT); d.moreT = null;
    d.k = k; d.pill = pill;
    solPaint(k, pill, {typing: true, x: d.x, y: d.y});
  }
  /* The box grows around the pointer, so what is under it as it zooms stays
     put. The point follows the pointer only on the way in; once the pointer is
     over the box, the box holds still so the options do not swim under it.
     Done after it has reached down, so its new height is already counted. */
  if (box && solZoomOn()) {
    if (k !== d.ak) { d.ak = k; d.held = false; }
    if (d.held && !solInside(box.getBoundingClientRect(), d.x, d.y)) d.held = false;
    if (!d.held) { d.at = solAnchor(box, d.x, d.y); d.held = solInside(solBase(box), d.x, d.y); }
  }
  if (pill) solArrow(solCardEl() || d.ghost, pill, solPillWord(box, pill)); else solArrow(null);
});
