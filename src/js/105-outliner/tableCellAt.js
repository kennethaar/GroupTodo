// The offset where cell c of a row written by tableRowText begins.
function tableCellAt(line, c) {
  let at = 2;
  for (let k = 0; k < c; k++) at += (tableCells(line)[k] || "").length + 3;
  return at;
}
