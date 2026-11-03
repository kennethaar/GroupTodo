/* ---------- Markdown tables (#269) ----------
   A line that starts and ends with | is a table row. The bullet holds the
   header, its body the | --- | line and the rows, so the file is a plain
   Markdown table that Obsidian and GitHub draw as well. */
const TABLE_ROW_RE = /^\s*\|.*\|\s*$/;
const TABLE_SEP_RE = /^\s*\|(\s*:?-+:?\s*\|)+\s*$/;
// The block whose rows are open for writing; the rest show as a table.
let TABLE_OPEN = null;
