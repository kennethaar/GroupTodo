/* Where the caret is in a table you are writing in: bi the line (-1 the
   header) and col the column, or null when it is not in one of its rows.
   With keep, what is typed in the row so far becomes part of the table. */
function tableAt(b, txt, keep = true) {
  const on = document.activeElement;
  const bi = on === txt ? -1 : on && on.dataset && on.dataset.bi != null && on.parentNode === txt.closest(".blk") ? +on.dataset.bi : null;
  if (bi === null) return null;
  const text = lineText(on);
  if (keep) { if (bi < 0) b.title = text; else b.body[bi] = text; }
  if (!tableRows(b)) return null;
  return {bi, col: tableCol(text, caretOffsets(on)[0])};
}
