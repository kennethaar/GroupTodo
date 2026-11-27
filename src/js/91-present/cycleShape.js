/* Where a cycle's n lines and arrows go (#433), round an oval k times as wide
   as it is tall (#479): k = 1 is the round ring. In a viewBox 100k wide and
   100 high; each line's place is in % of the ring. angles may place each line
   round the oval (radians, clockwise from the top), so the air between boxes
   is even; ends(i, at, pt, tip) may give the angles an arrow runs between, so
   it stays in that air. */
function cycleShape(n, k = 1, angles, ends) {
  const W = 100 * k, cx = W / 2, rx = cx - 14, ry = 36, gap = Math.min(0.5, Math.PI / n * 0.5);
  const at = i => angles ? angles[i % n] + Math.floor(i / n) * 2 * Math.PI : i / n * 2 * Math.PI - Math.PI / 2;
  const pt = a => [cx + rx * Math.cos(a), 50 + ry * Math.sin(a)];
  const unit = (x, y) => { const l = Math.hypot(x, y) || 1; return [x / l, y / l]; };
  const along = a => unit(-rx * Math.sin(a), ry * Math.cos(a));
  const tip = a => { const [x, y] = pt(a), d = along(a); return [x + d[0] * 3, y + d[1] * 3]; };
  return Array.from({length: n}, (_, i) => {
    const [a0, a1] = ends?.(i, at, pt, tip) || [at(i) + gap, at(i + 1) - gap], [x0, y0] = pt(a0), [x1, y1] = pt(a1);
    const fwd = along(a1), out = unit(ry * Math.cos(a1), rx * Math.sin(a1));
    const [lx, ly] = pt(at(i));
    return {
      arc: `M${x0},${y0} A${rx},${ry} 0 0 1 ${x1},${y1}`,
      head: `M${x1 + fwd[0] * 3},${y1 + fwd[1] * 3} L${x1 + out[0] * 2},${y1 + out[1] * 2} L${x1 - out[0] * 2},${y1 - out[1] * 2}Z`,
      left: lx / W * 100, top: ly};
  });
}
