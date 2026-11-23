/* Pyramid (#433): a tier per line, the first at the bottom as the
   foundation, the last at the peak; the words beside each tier. */
function drawPyramid(s) {
  const n = s.kids.length, side = w => [(1 - w) * 50, (1 + w) * 50];
  return el("div", {class: "pyramid"}, ...s.kids.map((b, i) => {
    const [bl, br] = side(1 - i / n), [tl, tr] = side(1 - (i + 1) / n);
    return slidePart(b, "tier",
      el("span", {class: "tshape", style: `clip-path:polygon(${tl}% 0,${tr}% 0,${br}% 100%,${bl}% 100%)`}),
      el("span", {class: "ttext"}, slideText(b)));
  }));
}
