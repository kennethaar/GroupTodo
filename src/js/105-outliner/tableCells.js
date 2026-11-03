// The cells of a row, without the outer pipes. "\|" is a pipe inside a cell.
function tableCells(line) {
  const s = trim(line).slice(1, -1);
  return s.split(/(?<!\\)\|/).map(trim);
}
