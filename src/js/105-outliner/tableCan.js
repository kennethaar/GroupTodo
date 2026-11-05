/* The table commands that make sense where the caret is: bi the line (-1 the
   header, 0 the | --- | line, then the rows) and col the column. The header
   stays first and the | --- | line second, so neither moves or goes. */
function tableCan(b, bi, col) {
  const n = tableRows(b), w = tableCells(b.title).length;
  if (!n) return [];
  const al = tableAlign(tableCells(b.body[0])[col]);
  const row = bi >= 1, last = n - 1;
  return [
    ...(row ? ["row-above"] : []),
    ...(bi !== 0 ? ["row-below"] : []),
    ...(row && bi > 1 ? ["row-up"] : []),
    ...(row && bi < last ? ["row-down"] : []),
    ...(row ? ["row-del"] : []),
    "col-left", "col-right",
    ...(col > 0 ? ["col-mvleft"] : []),
    ...(col < w - 1 ? ["col-mvright"] : []),
    ...(w > 1 ? ["col-del"] : []),
    ...["left", "center", "right"].filter(a => a !== al).map(a => "al-" + a),
  ];
}
