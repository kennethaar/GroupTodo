/* A chart's line (#482): words, then a number at the end, maybe with a
   currency, a percent or k, M, B after it: "North 42", "2023: 1850",
   "Pipeline NOK 40k". `shown` is the number as written. A number inside the
   line ("Call 3 people") or a line that is only a number gives null. */
function slideChartPoint(text) {
  const m = CHART_POINT_RE.exec(trim(String(text || "")));
  if (!m) return null;
  const label = trim(m[1].replace(/\s*[:\-–]\s*$/, ""));
  const value = slideChartNum(m[2]);
  if (!label || value === null) return null;
  return {label, value, shown: trim(m[2])};
}
