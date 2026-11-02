/* The next box one way across the numpad, over any empty place. Into the
   middle is back to the card. */
function solKbMove(dx, dy) {
  const at = SOL_GRID.indexOf(SOL_KB ? SOL_KB.k : "CARD");
  let x = at % 3, y = Math.floor(at / 3);
  for (;;) {
    x += dx; y += dy;
    if (x < 0 || x > 2 || y < 0 || y > 2) return;
    const k = SOL_GRID[y * 3 + x];
    if (k === "CARD") { solKbClose(); return; }
    if (solKbOpen(k)) return;
  }
}
