/* The paragraph in a part of the page that crosses height y, or the one
   nearest it: {node, gap}. Paragraphs not on screen are left out. */
function tpNearest(within, y) {
  let node = null, gap = Infinity;
  for (const u of within.querySelectorAll(TP_UNITS)) {
    const ur = u.getBoundingClientRect();
    if (!ur.height) continue;
    const d = y < ur.top ? ur.top - y : y > ur.bottom ? y - ur.bottom : 0;
    if (d < gap) { gap = d; node = u; }
  }
  return {node, gap};
}
