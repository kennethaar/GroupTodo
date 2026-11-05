/* The Table menu, behind the button on a table you are writing in: Row,
   Column and Alignment, each with only the commands that fit the caret. */
const TABLE_CMDS = {
  Row: [["row-above", "Insert above"], ["row-below", "Insert below"], ["row-up", "Move up"], ["row-down", "Move down"], ["row-del", "Delete"]],
  Column: [["col-left", "Insert left"], ["col-right", "Insert right"], ["col-mvleft", "Move left"], ["col-mvright", "Move right"], ["col-del", "Delete"]],
  Alignment: [["al-left", "Left"], ["al-center", "Center"], ["al-right", "Right"]],
};
function tableMenu(path, b, txt) {
  const on = document.activeElement;
  const bi = on === txt ? -1 : on && on.dataset && on.dataset.bi != null && on.parentNode === txt.closest(".blk") ? +on.dataset.bi : null;
  if (bi === null) return;
  const text = lineText(on);
  // What is typed in the row so far is part of the table now.
  if (bi < 0) b.title = text; else b.body[bi] = text;
  if (!tableRows(b)) return;
  const col = tableCol(text, caretOffsets(on)[0]), can = tableCan(b, bi, col);
  const group = name => TABLE_CMDS[name].filter(([c]) => can.includes(c));
  const sub = name => chipMenu(name, null, lettered(group(name).map(([c, label]) => [label, null, () => tableRun(path, b, c, bi, col)])));
  chipMenu("Table", null, lettered(Object.keys(TABLE_CMDS).filter(name => group(name).length).map(name => [name, null, () => sub(name)])));
}
