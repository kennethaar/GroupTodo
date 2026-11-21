/* Plain text as a table (#469), in this order: tab separated; comma or
   semicolon separated with the same count on every line, "quoted, cells"
   kept whole; pipe separated that is not a Markdown table yet; columns
   lined up with 2 or more spaces. At least 2 lines and 2 columns. An
   outline (lines starting "- ") or a Markdown table is left as it is. */
function tableFromText(text) {
  const lines = String(text).replace(/\r\n?/g, "\n").split("\n").filter(l => trim(l) !== "");
  if (lines.length < 2 || lines.some(l => /^\s*[-*+]\s/.test(l) || TABLE_SEP_RE.test(l))) return null;
  const even = rows => rows.every(r => r.length === rows[0].length) && rows[0].length >= 2 ? rows : null;
  if (lines[0].includes("\t") && lines.filter(l => l.includes("\t")).length * 2 >= lines.length)
    return lines.map(l => l.split("\t").map(trim));
  for (const sep of [",", ";"]) {
    const rows = lines.map(l => splitQuoted(l, sep));
    if (rows.every(Boolean) && even(rows)) return rows;
  }
  if (lines.every(l => l.includes("|"))) {
    const rows = even(lines.map(l => trim(l).replace(/^\|/, "").replace(/(?<!\\)\|$/, "").split(/(?<!\\)\|/).map(trim)));
    if (rows) return rows;
  }
  return even(lines.map(l => trim(l).split(/\s{2,}/)));
}
