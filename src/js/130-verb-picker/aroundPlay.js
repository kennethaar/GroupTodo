function aroundPlay(grid) {
  const was = AROUND_FLIP;
  AROUND_FLIP = null;
  if (!was || !was.size) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  requestAnimationFrame(() => {
    const moved = [];
    for (const n of [...aroundNodes(grid), ...grid.querySelectorAll(".aself")]) {
      const from = was.get(n.dataset.node);
      if (!from) continue;
      const to = n.getBoundingClientRect();
      const dx = from.left - to.left, dy = from.top - to.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) continue;
      n.style.transition = "none";
      n.style.transform = "translate(" + dx + "px," + dy + "px)";
      moved.push(n);
    }
    if (!moved.length) return;
    requestAnimationFrame(() => {
      for (const n of moved) { n.style.transition = ""; n.style.transform = ""; }
    });
  });
}
