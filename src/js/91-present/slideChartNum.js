/* The value of a chart's number as written (#482): "-3,5 %" is -3.5,
   "NOK 40k" 40000, "40 000" 40000. Anything else gives null. */
function slideChartNum(text) {
  const m = CHART_NUM_RE.exec(trim(String(text || "")));
  if (!m) return null;
  const n = parseFloat(m[1].replace(/[  ]/g, "").replace("−", "-").replace(",", "."));
  const times = {k: 1e3, K: 1e3, M: 1e6, B: 1e9, bn: 1e9}[m[2]] || 1;
  return Number.isFinite(n) ? n * times : null;
}
