/* Slide layouts (#433). Each says how many lines a slide needs (min), how
   many fit on one slide before it goes on to the next (max), and whether a
   line's own lines are drawn inside its box ("2d") or get a slide ("1d").
   "list" is today's title and bullets: never cut, slideFit shrinks it. */
const SLIDE_LAYOUTS = {
  list:     {min: 0, max: Infinity, mode: "1d", name: "List"},
  hero:     {min: 1, max: 9, mode: "2d", name: "Quote"},
  process:  {min: 2, max: 9, mode: "1d", name: "Steps"},
  timeline: {min: 2, max: 9, mode: "1d", name: "Timeline"},
  cycle:    {min: 3, max: 9, mode: "1d", name: "Cycle"},
  pyramid:  {min: 3, max: 9, mode: "1d", name: "Pyramid"},
  hub:      {min: 3, max: 9, mode: "2d", name: "Hub"},
  curve:    {min: 2, max: 9, mode: "1d", name: "Curve"},
  split:    {min: 2, max: 9, mode: "2d", name: "Versus"},
  quadrant: {min: 4, max: 9, mode: "2d", name: "2×2"},
  kpi:      {min: 1, max: 9, mode: "2d", name: "Scorecard"},
  grid:     {min: 2, max: 9, mode: "2d", name: "Grid"},
  // A Markdown table (#469), a slide of its own: a row, or a column, per step.
  table:    {min: 1, max: 1, mode: "1d", name: "Table"},
  /* Charts (#482): lines that end in a number, or one table, a point, bar
     or slice per step. A pie has at most CHART_PIE_MAX slices. */
  line:     {min: 1, max: 24, mode: "1d", name: "Line"},
  bar:      {min: 1, max: 16, mode: "1d", name: "Bar"},
  pie:      {min: 1, max: 6, mode: "1d", name: "Pie"},
  // A picture behind the slide, with cards, badges and pins on it (#488): one slide, however many lines.
  map:      {min: 1, max: Infinity, mode: "2d", name: "Map"},
};
const CHART_PIE_MAX = 6;
const SLIDE_CHARTS = ["line", "bar", "pie"];
/* A chart's number (#482): maybe a currency before it, then the number
   (thousands may be spaced: 40 000), maybe k, M, B or bn, then maybe a
   percent or a currency. A chart line is words, maybe ":", then that. */
const CHART_NUM_SRC = `(?:(?:${PRICE_CUR})[ \\u00A0]?)?([-\\u2212+]?(?:\\d{1,3}(?:[ \\u00A0]\\d{3})+|\\d+)(?:[.,]\\d+)?)`
  + `[ \\u00A0]?(bn|k|K|M|B)?[ \\u00A0]?(?:%|${PRICE_CUR})?(?:,-)?`;
const CHART_NUM_RE = new RegExp(`^${CHART_NUM_SRC}$`, "u");
const CHART_POINT_RE = new RegExp(`^(.*?\\S)\\s*:?\\s+(${CHART_NUM_SRC})$`, "u");
// More bullets than this on one slide are marked red in the outline (#433).
const SLIDE_CALM = 5;
/* The marks at the front of a line, plain text in the .md file. Never marks:
   "@ " (a context), "+ " (a Markdown bullet), "(*) ", 🎯 and a bare number.
   "> " is a quote only; "| " is split or 2×2 by the number of lines. */
const SLIDE_MARKS = [
  [/^\d+\.\s+/, "process"],
  [/^step\s+\d+\s*:\s*/i, "process"],
  [/^(?:->|>>)\s+/, "timeline"],
  [/^>\s+/, "hero"],
  [/^["“”]([^"“”]+)["“”]$/, "hero"],
  [/^\(o\)\s+/, "cycle"],
  [/^(?:\^|\/\\)\s+/, "pyramid"],
  [/^🔺\s*/u, "pyramid"],
  [/^\.\s+/, "hub"],
  [/^~\s+/, "curve"],
  [/^\|\s+/, "split"],
  [/^[$%]\s+/, "kpi"],
];
/* The layout words (#481): "(pyramid) What creates value" at the front of a
   line says how its lines are drawn. Each: the word, the layout, the icon
   its bullet shows, and what its lines become. In the order "(" lists them;
   2×2 is also written 2x2. */
const SLIDE_WORDS = [
  ["list", "list", "≡", "a title and bullets"],
  ["steps", "process", "→", "one after another"],
  ["timeline", "timeline", "↦", "points in time"],
  ["cycle", "cycle", "↻", "goes round"],
  ["pyramid", "pyramid", "▲", "base to top"],
  ["hub", "hub", "✳", "around a center"],
  ["curve", "curve", "∿", "a line that rises or falls"],
  ["versus", "split", "◫", "two side by side"],
  ["2x2", "quadrant", "⊞", "four boxes"],
  ["scorecard", "kpi", "%", "the numbers that matter"],
  ["line", "line", "⌁", "numbers over time"],
  ["bar", "bar", "▮", "numbers side by side"],
  ["pie", "pie", "◔", "parts of a whole"],
  ["quote", "hero", "❝", "one quote, big"],
  ["grid", "grid", "▦", "cards"],
  ["map", "map", "⌖", "pins on a picture"],
];
const SLIDE_WORD_RE = /^\(([\p{L}\p{N}×]+)\)(?:\s+|$)/u;
// A trailing (Y / X) on a curve slide's title names its axes.
const SLIDE_AXES_RE = /\s*\(([^()\/]+)\/([^()\/]+)\)\s*$/;
/* A metric on a scorecard: a percent, or an amount read as expenses read it
   (PRICE_CUR), here also with k, M, B or bn after the number: $2M, NOK 40k. */
const KPI_NUM = `(?:${PRICE_SIGNED})(?:bn|k|K|M|B)?`;
const KPI_RE = new RegExp(`(?<![\\p{L}\\p{N}])(?:[-\\u2212+]?\\d+(?:[.,]\\d+)?[ \\u00A0]?%`
  + `|(?:${PRICE_CUR})[ \\u00A0]?${KPI_NUM}|${KPI_NUM}[ \\u00A0]?(?:${PRICE_CUR}))(?:,-)?(?![\\p{L}\\p{N}])`, "u");
/* Format › Slide layout (#433): the layouts a pick can write, each with the
   mark it puts in front of a line. Auto takes the marks off. Steps numbers
   the lines; "| " is versus on 2 lines and a 2×2 on 4. */
const SLIDE_MENU = [
  ["auto", "Auto", ""],
  ["process", "Steps", "1."],
  ["timeline", "Timeline", "->"],
  ["cycle", "Cycle", "(o)"],
  ["pyramid", "Pyramid", "^"],
  ["hub", "Hub", "."],
  ["curve", "Curve", "~"],
  ["split", "Versus / 2×2", "|"],
  ["kpi", "Scorecard", "$"],
];
