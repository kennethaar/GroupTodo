/* Where the caret sits in the field, counted in characters of its plain text,
   so a line can be cut in two at exactly that point. A selection gives back
   both of its ends, and what lies between them is what a paste replaces. */
function caretOffsets(host) {
  const text = hostText(host);
  if (!host.isContentEditable)
    return [host.selectionStart ?? text.length, host.selectionEnd ?? text.length];
  const sel = getSelection();
  if (!sel || !sel.rangeCount || !host.contains(sel.anchorNode)) return [text.length, text.length];
  const r = sel.getRangeAt(0), pre = document.createRange();
  pre.selectNodeContents(host);
  pre.setEnd(r.startContainer, r.startOffset);
  const start = pre.toString().length;
  if (!host.contains(r.endContainer)) return [start, start];
  pre.setEnd(r.endContainer, r.endOffset);
  return [start, pre.toString().length];
}
