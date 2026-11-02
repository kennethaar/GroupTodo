function aroundCapture(grid) {
  if (!grid) return;
  AROUND_FLIP = new Map();
  for (const n of [...aroundNodes(grid), ...grid.querySelectorAll(".aself")]) {
    const k = n.dataset.node;
    if (k) AROUND_FLIP.set(k, n.getBoundingClientRect());
  }
}
