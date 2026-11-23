/* How a slide line is drawn (#433), first match wins: its layout word, a token in its title,
   then the mark most of its lines carry (a tie goes to the first line's),
   then a metric on every line (a scorecard), else today's list. A layout
   with fewer lines than it needs is a list too, as is "| " on other than 2
   (versus) or 4 (2×2) lines, and a quote on more than one. */
function slideLayout(block, kids = block?.children || []) {
  /* The word on the line (#481) comes first; `word` is it when the title
     given is already the slide's words. Versus on four lines is a 2×2. */
  const w = slideWord(block?.title || ""), tok = slideTitleTokens(w.rest);
  const n = kids.length;
  let word = block?.word || w.layout;
  if (word === "split" && n === 4) word = "quadrant";
  // One line that is a Markdown table is the slide's table (#469).
  let layout = word || tok.layout || (n === 1 && tableRows(kids[0]) ? "table" : null);
  if (!layout) {
    layout = slideMarkOf(kids);
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
