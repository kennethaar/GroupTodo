/* How a slide line is drawn (#433), first match wins: its layout word, a token in its title,
   then the mark most of its lines carry (a tie goes to the first line's),
   then 1-4 metrics (a scorecard), lines that end in numbers (a line chart,
   #482), else today's list. A layout
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
  /* Numbers (#482): 1-4 metrics are a scorecard; two or more lines that
     end in a number, none with lines of its own, a line chart. */
  const kpi = n && kids.every(k => slideKpi(slideWords(k)));
  if (!layout && kpi && n <= 4) layout = "kpi";
  // Numbers that only count the lines (Item 1, Item 2…) are numbering, not data.
  let guess = false;
  if (!layout && n >= 2 && !kids.some(k => (k.children || []).length)) {
    const data = slideChartData(kids);
    if (data && !data.series[0].values.every((v, i) => v === i + 1)) layout = "line", guess = true;
  }
  if (!layout && kpi) layout = "kpi";
  // A chart word on lines with no numbers is a list; a pie of many slices, bars.
  if (SLIDE_CHARTS.includes(layout)) {
    const data = slideChartData(kids);
    if (!data) layout = "list";
    else if (layout === "pie" && data.cats.length > CHART_PIE_MAX) layout = "bar";
  }
  if ((layout === "split" && n !== 2) || (layout === "quadrant" && n !== 4) || (layout === "hero" && n !== 1)
    || !SLIDE_LAYOUTS[layout] || n < SLIDE_LAYOUTS[layout].min) layout = "list";
  const spec = SLIDE_LAYOUTS[layout];
  const mode = layout !== "grid" ? spec.mode
    : !tok.oneD && kids.some(k => (k.children || []).length) ? "2d" : "1d";
  const curve = layout === "curve";
  // `guess`: a line chart read from the numbers alone, no word or mark (#482).
  return {layout, mode, max: spec.max, axes: curve ? tok.axes : null, guess: guess && layout === "line",
    title: curve ? trim(tok.words.replace(SLIDE_AXES_RE, "")) : tok.words};
}
