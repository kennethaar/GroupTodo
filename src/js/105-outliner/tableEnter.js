/* Enter on a table row, the bullet's own line (i = -1) or a body line i.
   The first time, "|a|b|" is set out as a header with its | --- | line under
   it. Each Enter then adds an empty row with the caret in its first cell,
   and Enter on an empty last row leaves the table for a new bullet, as in
   Obsidian. False when the line is no table row, so Enter does what it does. */
function tableEnter(path, b, i, txt) {
  const text = lineText(txt);
  if (!TABLE_ROW_RE.test(text) || (i < 0 && b.state)) return false;
  if (i >= 0 && !(i < tableRows(b) && TABLE_ROW_RE.test(b.title || ""))) return false;
  const body = b.body || (b.body = []);
  const n = tableCells(i < 0 ? text : b.title).length;
  const sep = TABLE_SEP_RE.test(text);
  const cells = tableCells(text);
  // Blur is what writes the line back, so hand it the row set out.
  txt.textContent = sep ? text : tableRowText(cells, n);
  txt.blur();
  if (i < 0) {
    if (!TABLE_SEP_RE.test(body[0] || "")) body.unshift(tableRowText(Array(n).fill("---")));
    i = 0;
  } else if (!sep && i === tableRows(b) - 1 && cells.every(c => !c)) {
    body.splice(i, 1);
    const page = getPage(path), sibs = siblingsOf(page, b), nb = newBlock({});
    sibs.splice(sibs.indexOf(b) + 1, 0, nb);
    TABLE_OPEN = null;
    touch(path); render(); focusBlock(nb.id);
    return true;
  }
  body.splice(i + 1, 0, tableRowText([], n));
  touch(path); render();
  tableFocusRow(b, i + 1);
  return true;
}
