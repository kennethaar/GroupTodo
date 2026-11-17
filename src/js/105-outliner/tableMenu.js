/* The Row and Column menus (#281), behind their buttons on a table you are
   writing in, each with only the commands that fit the caret. Alignment is
   not a menu: it has its own three toggles (tableBar). */
const TABLE_CMDS = {
  Row: [["row-above", "Insert above"], ["row-below", "Insert below"], ["row-up", "Move up"], ["row-down", "Move down"], ["row-del", "Delete"]],
  Column: [["col-left", "Insert left"], ["col-right", "Insert right"], ["col-mvleft", "Move left"], ["col-mvright", "Move right"], ["col-del", "Delete"]],
};
function tableMenu(path, b, txt, name) {
  const at = tableAt(b, txt);
  if (!at) return;
  const can = tableCan(b, at.bi, at.col);
  const rows = TABLE_CMDS[name].filter(([c]) => can.includes(c));
  if (rows.length) chipMenu(name, null, lettered(rows.map(([c, label]) => [label, null, () => tableRun(path, b, c, at.bi, at.col)])));
}
