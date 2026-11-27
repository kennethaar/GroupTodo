/* A bar chart (#482): a row per category, its bars running right from 0
   (left for a number below 0), the category before them and each number
   just past its bar. With more than one series the first row's numbers
   also name their series, so no legend is needed. */
function drawChartBar(s) {
  const {cats, series} = slideChartData(s.kids);
  const all = series.flatMap(r => r.values), lo = Math.min(0, ...all), hi = Math.max(0, ...all), span = hi - lo || 1;
  const catw = Math.min(16, Math.max(...cats.map(c => c.length), 2));
  const parts = s.parts.map((p, i) => slidePart(p, "crow",
    el("span", {class: "ccat"}, cats[i]),
    el("div", {class: "cbars"}, ...series.map((r, k) => {
      const v = r.values[i], left = (Math.min(v, 0) - lo) / span * 100, width = Math.abs(v) / span * 100;
      return el("div", {class: "cbarw"},
        el("div", {class: "cbarfill c" + k, style: `left:${left}%;width:${width}%`}),
        el("span", {class: "cval", style: `left:${left + width}%`},
          (series.length > 1 && i === 0 ? r.name + " " : "") + slideChartFmt(r, i)));
    }))));
  return el("div", {class: "chart cbar", style: `--catw:${catw}ch`}, ...parts);
}
