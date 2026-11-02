/* ---------- the query builder ----------
   A query is easier to say than to spell, so it is said here: what to match,
   all of it or any of it, with the matches counted as you go. What it writes
   is the plain query text, the same Logseq would read, and Edit as text is
   always there for the parts the form has no row for. */
const QB_KINDS = [
  ["task",     "Task in state"],
  ["link",     "Links to page"],
  ["tag",      "Has tag"],
  ["text",     "Contains words"],
  ["page",     "Written on page"],
  ["prop",     "Line has value"],
  ["pageprop", "Page has value"],
  ["between",  "From the days"],
];
const qbQuote = s => /[\s()"]/.test(s) || !s ? '"' + String(s).replace(/"/g, "") + '"' : s;
