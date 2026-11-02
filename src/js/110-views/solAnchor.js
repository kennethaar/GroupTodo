function solAnchor(box, x, y) {
  const b = solBase(box), s = SOL_ZOOM, area = ($("#content") || document.body).getBoundingClientRect();
  const at = [solFit(x, b.left, b.width, area.left + 4, area.right - 4, s), solFit(y, b.top, b.height, area.top + 4, area.bottom - 4, s)];
  solOrigin(box, ...at);
  // Also in pixels from the box's corner, which a redraw that makes it taller keeps.
  return [...at, at[0] * b.width, at[1] * b.height];
}
