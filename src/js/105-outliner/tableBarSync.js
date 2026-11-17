// Presses the alignment toggle of the column the caret is in (#281).
function tableBarSync(node, b, txt) {
  const at = tableAt(b, txt, false);
  const al = at ? tableAlign(tableCells(b.body[0])[at.col]) : null;
  for (const t of node.querySelectorAll(".tablebar .tbalign")) t.setAttribute("aria-pressed", String(t.dataset.al === al));
}
