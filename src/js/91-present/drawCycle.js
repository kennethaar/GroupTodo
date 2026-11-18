/* Cycle (#433): the lines round a ring, clockwise from the top, each with
   the arrow on to the next; the last one feeds the first. */
function drawCycle(s) {
  const n = s.kids.length, r = 36, gap = Math.min(0.5, Math.PI / n * 0.5);
  const at = i => i / n * 2 * Math.PI - Math.PI / 2;
  const pt = a => [50 + r * Math.cos(a), 50 + r * Math.sin(a)];
  return el("div", {class: "ring"}, ...s.kids.map((b, i) => {
    const a0 = at(i) + gap, a1 = at(i + 1) - gap, [x0, y0] = pt(a0), [x1, y1] = pt(a1);
    const along = [-Math.sin(a1), Math.cos(a1)], out = [Math.cos(a1), Math.sin(a1)];
    const head = `M${x1 + along[0] * 3},${y1 + along[1] * 3} L${x1 + out[0] * 2},${y1 + out[1] * 2} L${x1 - out[0] * 2},${y1 - out[1] * 2}Z`;
    const [lx, ly] = pt(at(i));
    return slidePart(b, "node",
      slideSvg("svg", {viewBox: "0 0 100 100", "aria-hidden": "true"},
        slideSvg("path", {d: `M${x0},${y0} A${r},${r} 0 0 1 ${x1},${y1}`, class: "sline"}),
        slideSvg("path", {d: head, class: "shead"})),
      el("span", {class: "ntext", style: `left:${lx}%;top:${ly}%`}, slideWords(b)));
  }));
}
