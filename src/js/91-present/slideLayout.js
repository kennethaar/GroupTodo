/* How a slide line is drawn (#433), first match wins: a token in its title,
   then the mark most of its lines carry (a tie goes to the first line's),
   then a metric on every line (a scorecard), else today's list. A layout
   with fewer lines than it needs is a list too, as is "| " on other than 2
   (versus) or 4 (2×2) lines, and a quote on more than one. */
function slideLayout(block, kids = block?.children || []) {
  const tok = slideTitleTokens(block?.title || "");
  const n = kids.length;
  let layout = tok.layout;
  if (!layout) {
    const marks = kids.map(k => slideMark(k.title).layout), count = {};
    for (const m of marks) if (m) count[m] = (count[m] || 0) + 1;
    const top = Math.max(0, ...Object.values(count));
    if (top) layout = marks.find(m => m && count[m] === top);
    if (layout === "split" && n === 4) layout = "quadrant";
  }
  if (!layout && n && kids.every(k => slideKpi(slideWords(k)))) layout = "kpi";
  if ((layout === "split" && n !== 2) || (layout === "quadrant" && n !== 4) || (layout === "hero" && n !== 1)
    || !SLIDE_LAYOUTS[layout] || n < SLIDE_LAYOUTS[layout].min) layout = "list";
  const spec = SLIDE_LAYOUTS[layout];
  const mode = layout !== "grid" ? spec.mode
    : !tok.oneD && kids.some(k => (k.children || []).length) ? "2d" : "1d";
  const curve = layout === "curve";
  return {layout, mode, max: spec.max, axes: curve ? tok.axes : null,
    title: curve ? trim(tok.words.replace(SLIDE_AXES_RE, "")) : tok.words};
}
