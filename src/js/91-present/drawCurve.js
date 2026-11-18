/* Curve (#433): learning and forgetting. Each line is a peak; after it the
   curve falls away, less steeply every time, and the last line holds as a
   plateau. The title's (Y / X) names the axes. */
function drawCurve(s) {
  const n = s.kids.length, X = i => 6 + i * 88 / n, Y = v => 94 - v * 76;
  let from = 0;
  const parts = s.kids.map((b, i) => {
    const x0 = X(i), x1 = i < n - 1 ? X(i + 1) : 96, last = i === n - 1;
    const floor = 0.1 + 0.6 * i / n, tau = 3 * (i + 1) ** 1.6;
    const v = t => last ? 1 - 0.05 * t / (x1 - x0) : floor + (1 - floor) * Math.exp(-t / tau);
    let d = `M${x0},${Y(from)} L${x0},${Y(1)}`;
    for (let k = 1; k <= 16; k++) { const t = (x1 - x0) * k / 16; d += ` L${x0 + t},${Y(v(t))}`; }
    from = v(x1 - x0);
    return slidePart(b, "peak",
      slideSvg("svg", {viewBox: "0 0 100 100", preserveAspectRatio: "none", "aria-hidden": "true"},
        slideSvg("path", {d, class: "sline", "vector-effect": "non-scaling-stroke"})),
      el("span", {class: "ntext", style: `left:${x0}%;bottom:${100 - Y(1)}%`}, slideWords(b)));
  });
  return el("div", {class: "curve"},
    slideSvg("svg", {class: "axes", viewBox: "0 0 100 100", preserveAspectRatio: "none", "aria-hidden": "true"},
      slideSvg("path", {d: "M3,2 L3,97 L99,97", "vector-effect": "non-scaling-stroke"})),
    s.axes ? el("span", {class: "yaxis"}, s.axes.y) : null,
    s.axes ? el("span", {class: "xaxis"}, s.axes.x) : null,
    ...parts);
}
