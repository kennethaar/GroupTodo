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
  hub:      {min: 3, max: 9, mode: "1d", name: "Hub"},
  curve:    {min: 2, max: 9, mode: "1d", name: "Curve"},
  split:    {min: 2, max: 9, mode: "2d", name: "Versus"},
  quadrant: {min: 4, max: 9, mode: "2d", name: "2×2"},
  kpi:      {min: 1, max: 9, mode: "2d", name: "Scorecard"},
  grid:     {min: 2, max: 9, mode: "2d", name: "Grid"},
};
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
