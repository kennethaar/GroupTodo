/* A pasted table (#469), as rows of cells, the first row the header, short
   rows padded out. The first that fits wins: a <table> in the copied HTML
   (Excel, Word, Google Sheets, a web page), then the plain text as tab,
   comma or semicolon, pipe or space separated columns. null when it is not
   a table, so a sentence with a comma pastes as it always did. */
function pastedTable(html, text) {
  const rows = (html && tableFromHtml(html)) || tableFromText(text || "");
  if (!rows) return null;
  const w = Math.max(...rows.map(r => r.length));
  return rows.map(r => [...r, ...Array(w - r.length).fill("")]);
}
