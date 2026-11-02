function aroundNavKeys(grid) {
  grid.addEventListener("keydown", e => {
    const picking = grid.classList.contains("picking");
    if (e.key === "Escape" && picking) {
      /* In a panel, the second Escape closes it, which is what Escape has
         always done there: select mode costs one extra press and takes nothing
         away. On a page there is nothing to close, so Escape just puts the
         arrows back. */
      aroundSelect(grid, false);
      /* The same keypress goes on to the panel, which must not read it as a
         fresh request to start selecting again: one Escape, one meaning. */
      e.aroundLeft = true;
      if (!grid.closest(".modal")) { e.preventDefault(); e.stopPropagation(); }
      return;
    }
    if (!/^Arrow(Up|Down|Left|Right)$/.test(e.key)) return;
    if (!picking) return;
    const here = document.activeElement;
    if (!here || !here.classList.contains("achip")) return;
    const r = here.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const want = e.key.slice(5).toLowerCase();
    let best = null, bestScore = Infinity;
    for (const n of aroundNodes(grid)) {
      if (n === here) continue;
      const q = n.getBoundingClientRect();
      const dx = q.left + q.width / 2 - cx, dy = q.top + q.height / 2 - cy;
      const along = want === "up" ? -dy : want === "down" ? dy : want === "left" ? -dx : dx;
      if (along <= 1) continue;                       // not that way
      const across = Math.abs(want === "up" || want === "down" ? dx : dy);
      /* A cone, not a half plane. Without it the last node in a row answers
         Right by jumping to a different row, because something is always
         further right if you look far enough up. At the end of a row the end
         of the row is the honest answer. */
      if (across > along) continue;
      const score = along + across * 2.4;
      if (score < bestScore) { bestScore = score; best = n; }
    }
    e.preventDefault(); e.stopPropagation();
    if (best) best.focus();
  });
  grid.addEventListener("focusin", e => {
    if (e.target.classList.contains("achip")) aroundRingTo(grid, e.target);
  });
  grid.addEventListener("focusout", e => {
    if (grid.contains(e.relatedTarget)) return;
    grid.classList.remove("picking");
    aroundRingTo(grid, null);
  });
  /* Whatever you press, the grid is about to be rebuilt around it, so the old
     positions are taken now. */
  grid.addEventListener("click", e => {
    if (e.target.closest(".achip, .aself")) aroundCapture(grid);
  }, true);
}
