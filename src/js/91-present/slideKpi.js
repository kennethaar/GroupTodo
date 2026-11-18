/* A scorecard line (#433): its metric (a percent or an amount, KPI_RE) and
   its label, the rest of the line: "ARR: $2M" is $2M with the label ARR.
   A bare number is no metric, so "Q1: Private beta" gives null. */
function slideKpi(text) {
  const t = String(text || "");
  const m = KPI_RE.exec(t);
  if (!m) return null;
  const label = trim((t.slice(0, m.index) + " " + t.slice(m.index + m[0].length)).replace(/\s{2,}/g, " "));
  return {metric: m[0], label: trim(label.replace(/:\s*$/, ""))};
}
