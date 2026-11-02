/* The text between the start of the field and the caret. */
function textBeforeCaret(host) {
  if (!host.isContentEditable) return host.value.slice(0, host.selectionStart ?? 0);
  const sel = getSelection();
  if (!sel || !sel.rangeCount || !host.contains(sel.anchorNode)) return null;
  const r = document.createRange();
  r.selectNodeContents(host);
  r.setEnd(sel.anchorNode, sel.anchorOffset);
  return r.toString();
}
