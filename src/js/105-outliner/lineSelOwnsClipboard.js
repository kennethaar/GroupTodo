/* While lines are picked, the clipboard is theirs -- unless there is text
   selected inside a line, which is plain text editing as always. */
function lineSelOwnsClipboard() {
  if (!LINE_SEL.ids.length || $("#modalRoot").firstChild) return false;
  const sel = getSelection();
  return !sel || sel.isCollapsed;
}
