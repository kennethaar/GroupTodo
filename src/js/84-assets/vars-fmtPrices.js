// {NOK: 1200, EUR: 400} as "NOK 1 200 + EUR 400", or "" when it has nothing.
const fmtPrices = by => Object.entries(by || {}).filter(([, n]) => n).map(([c, n]) => fmtPrice(c, n)).join(" + ");

/* ---------- marks (#246) ----------
   [words]{.thought} marks a thought, {.sound} a sound and {.written} a letter,
   a sign or a message: Pandoc's spans, so a tool that makes a book of the
   file can set each its own way. Drawn in the app as the help says. */
const BOOK_MARKS = {thought: "Thought", sound: "Sound", written: "Written"};
const MARK_RE = /(^|[^\[])\[([^\[\]]+)\]\{\.(thought|sound|written)\}/g;
const MARK_ATTR_RE = /\{\.(?:thought|sound|written)\}/g;
