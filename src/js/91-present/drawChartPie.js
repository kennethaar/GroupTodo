/* A pie (#482): a slice per category, clockwise from the top, from the
   first series only. Each slice's name and share of the whole sit just
   outside it, so no legend is needed. A number below 0 counts as 0. */
function drawChartPie(s) {
  const {cats, series} = slideChartData(s.kids), vals = series[0].values.map(v => Math.max(0, v));
  const sum = vals.reduce((a, v) => a + v, 0) || 1, R = 36;
  const pt = (a, r) => [50 + r * Math.sin(a), 50 - r * Math.cos(a)];
  let from = 0;
  const parts = s.parts.map((p, i) => {
    const frac = vals[i] / sum, to = from + frac * 2 * Math.PI, mid = (from + to) / 2;
    const [x0, y0] = pt(from, R), [x1, y1] = pt(to, R), [lx, ly] = pt(mid, R + 7);
    const shape = frac > 0.9999 ? slideSvg("circle", {cx: 50, cy: 50, r: R, class: "cslice c" + (i % 6)})
      : slideSvg("path", {d: `M50,50 L${x0},${y0} A${R},${R} 0 ${frac > 0.5 ? 1 : 0} 1 ${x1},${y1} Z`, class: "cslice c" + (i % 6)});
    from = to;
    const side = Math.sin(mid) > 0.2 ? "right" : Math.sin(mid) < -0.2 ? "left" : "mid";
    return slidePart(p, "cslicep",
      slideSvg("svg", {viewBox: "0 0 100 100", "aria-hidden": "true"}, shape),
      el("span", {class: "cval " + side, style: `left:${lx}%;top:${ly}%`},
        el("span", {class: "ccat"}, cats[i]), " ", Math.round(frac * 100) + " %"));
  });
  return el("div", {class: "chart cpie"}, el("div", {class: "cpiebox"}, ...parts));
}
