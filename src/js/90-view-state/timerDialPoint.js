/* Where a pointer is on the dial's face: f is the share of max:: there,
   counter-clockwise from 0 at the top the way the numbers run, and r how far
   out, 1 at the rim. */
function timerDialPoint(dial, e) {
  const box = dial.querySelector(".tface").getBoundingClientRect();
  const R = box.width / 2 || 1, dx = e.clientX - box.left - R, dy = e.clientY - box.top - R;
  const a = Math.atan2(-dx, -dy);
  return {f: (a < 0 ? a + 2 * Math.PI : a) / (2 * Math.PI), r: Math.hypot(dx, dy) / R};
}
