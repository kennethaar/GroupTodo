/* Which box the pointer is in, or moving straight towards. The box already
   enlarged keeps the pointer for as long as it is inside its enlarged edge. */
function solTargetBox(x, y, vx, vy, cur) {
  if (cur && cur.isConnected && solInside(cur.getBoundingClientRect(), x, y)) return cur;
  const boxes = solBoxes();
  for (const b of boxes) if (solInside(solBase(b), x, y)) return b;
  const speed = Math.hypot(vx, vy);
  if (speed < 0.5) return null;
  let best = null, bd = Infinity;
  for (const b of boxes) {
    const r = solBase(b), d = solDist(r, x, y);
    if (d > SOL_LEAD) continue;
    const [cx, cy] = solMid(r);
    if ((cx - x) * vx + (cy - y) * vy <= 0) continue;          // moving away from it
    if (d < bd) { bd = d; best = b; }
  }
  return best;
}
