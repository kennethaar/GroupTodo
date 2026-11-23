/* A line chart (#482): a point per category, from left to right, each
   step drawing the line on to its point. The number sits over the point,
   the category under the axis, and with more than one series each line's
   name at its end, so no legend is needed. The axis starts at 0 unless a
   number is below it. */
function drawChartLine(s) {
  const {cats, series} = slideChartData(s.kids), n = cats.length;
  const all = series.flatMap(r => r.values), lo = Math.min(0, ...all), hi = Math.max(lo + 1e-9, ...all);
  const X = i => n === 1 ? 50 : 4 + i * 86 / (n - 1), Y = v => 90 - (v - lo) / (hi - lo) * 78;
  const at = (x, y) => `left:${x}%;top:${y}%`;
  const parts = s.parts.map((p, i) => slidePart(p, "cpt",
    i ? slideSvg("svg", {viewBox: "0 0 100 100", preserveAspectRatio: "none", "aria-hidden": "true"},
      ...series.map((r, k) => slideSvg("path", {d: `M${X(i - 1)},${Y(r.values[i - 1])} L${X(i)},${Y(r.values[i])}`,
        class: "sline c" + k, "vector-effect": "non-scaling-stroke"}))) : "",
    ...series.flatMap((r, k) => [
      el("span", {class: "cdot c" + k, style: at(X(i), Y(r.values[i])), "aria-hidden": "true"}),
      el("span", {class: "cval", style: at(X(i), Y(r.values[i]))}, slideChartFmt(r, i)),
      series.length > 1 && i === n - 1 ? el("span", {class: "cser c" + k, style: at(X(i), Y(r.values[i]))}, r.name) : ""]),
    el("span", {class: "ccat", style: at(X(i), Y(lo))}, cats[i])));
  return el("div", {class: "chart cline"},
    slideSvg("svg", {class: "axes", viewBox: "0 0 100 100", preserveAspectRatio: "none", "aria-hidden": "true"},
      slideSvg("path", {d: `M0,${Y(0)} L100,${Y(0)}`, "vector-effect": "non-scaling-stroke"})),
    ...parts);
}
