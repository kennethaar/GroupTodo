function aroundSelect(grid, on = true) {
  if (!grid) return false;
  const nodes = aroundNodes(grid);
  if (!nodes.length) return false;
  if (!on) { grid.classList.remove("picking"); grid.blur(); return true; }
  grid.classList.add("picking");
  // Start beside the thing in the middle rather than at the top left: the
  // nearest node to what you are looking at is the one you probably want.
  const self = grid.querySelector(".a-self");
  const from = self ? self.getBoundingClientRect() : grid.getBoundingClientRect();
  const cx = from.left + from.width / 2, cy = from.top + from.height / 2;
  let best = nodes[0], bestD = Infinity;
  for (const n of nodes) {
    const r = n.getBoundingClientRect();
    const d = Math.hypot(r.left + r.width / 2 - cx, r.top + r.height / 2 - cy);
    if (d < bestD) { bestD = d; best = n; }
  }
  best.focus();
  return true;
}
