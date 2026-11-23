/* Boxes with their lines in them (#433): versus (two columns), a 2×2, a
   scorecard (a big metric over its label) and plain cards. */
function drawCards(s) {
  const n = s.kids.length, kpi = s.layout === "kpi";
  const cols = s.layout === "split" || s.layout === "quadrant" ? 2
    : kpi || s.mode === "1d" || n <= 3 ? n : Math.ceil(n / 2);
  return el("div", {class: "cards", style: `--cols:${cols}`}, ...s.kids.map(b => {
    const words = slideWords(b), m = kpi ? slideKpi(words) : null;
    const head = kpi ? [el("div", {class: "pmetric"}, m ? m.metric : ""), el("div", {class: "plabel"}, m ? m.label : words)]
      : [el("div", {class: "phead"}, slideText(b))];
    const lines = (b.children || []).filter(k => slideWords(k));
    return slidePart(b, "card", ...head,
      lines.length ? el("ul", {}, ...lines.map(k => el("li", {"data-bid": k.id}, slideText(k)))) : null);
  }));
}
