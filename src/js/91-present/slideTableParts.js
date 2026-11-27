/* What → lights on a table slide (#469): its rows, the header shown from the
   start; or with reveal:: columns its columns, the first shown from the
   start. Each is a line as the presenter window lists it. `rows`: always
   by rows, as a chart of the table lights them (#482). */
function slideTableParts(t, rows = false) {
  const n = tableRows(t), head = tableCells(t.title);
  const part = (i, words) => ({id: t.id + ":" + i, title: words, body: [], children: []});
  if (!rows && slideTableCols(t)) return head.slice(1).map((h, i) => part(i, h));
  return t.body.slice(1, n).map((r, i) => part(i, tableCells(r).join(" · ")));
}
