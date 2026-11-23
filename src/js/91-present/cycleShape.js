/* Where a cycle's n lines and arrows go (#433), round an oval k times as wide
   as it is tall (#479): k = 1 is the round ring. In a viewBox 100k wide and
   100 high; each line's place is in % of the ring. */
function cycleShape(n, k = 1) {
  const W = 100 * k, cx = W / 2, rx = cx - 14, ry = 36, gap = Math.min(0.5, Math.PI / n * 0.5);
  const at = i => i / n * 2 * Math.PI - Math.PI / 2;
  const pt = a => [cx + rx * Math.cos(a), 50 + ry * Math.sin(a)];
  const unit = (x, y) => { const l = Math.hypot(x, y) || 1; return [x / l, y / l]; };
  return Array.from({length: n}, (_, i) => {
    const a0 = at(i) + gap, a1 = at(i + 1) - gap, [x0, y0] = pt(a0), [x1, y1] = pt(a1);
    const along = unit(-rx * Math.sin(a1), ry * Math.cos(a1)), out = unit(ry * Math.cos(a1), rx * Math.sin(a1));
    const [lx, ly] = pt(at(i));
    return {
      arc: `M${x0},${y0} A${rx},${ry} 0 0 1 ${x1},${y1}`,
      head: `M${x1 + along[0] * 3},${y1 + along[1] * 3} L${x1 + out[0] * 2},${y1 + out[1] * 2} L${x1 - out[0] * 2},${y1 - out[1] * 2}Z`,
      left: lx / W * 100, top: ly};
  });
}
