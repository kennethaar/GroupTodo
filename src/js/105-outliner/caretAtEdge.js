/* ---------- which visual line the caret is on ----------
   A title wraps, so "at the top of the block" is not "at character zero": a
   long line that has wrapped three times should let Up walk through all three
   before it leaves. So this measures where the caret actually is on screen and
   compares it with the block's own box.

   A collapsed caret at a text boundary returns no rectangle in Chrome, so when
   there is none we measure the character beside it instead. No rectangle at all
   means an empty block, which is both its first line and its last. */
function caretAtEdge(node) {
  const both = {first: true, last: true};
  const sel = getSelection();
  if (!sel || !sel.rangeCount || !node.contains(sel.anchorNode)) return both;

  const cs = getComputedStyle(node);
  const line = parseFloat(cs.lineHeight) || (parseFloat(cs.fontSize) || 14) * 1.4;
  const box = node.getBoundingClientRect();

  let rect = sel.getRangeAt(0).getClientRects()[0];
  if (!rect) {
    const tn = node.firstChild;
    if (!tn || tn.nodeType !== 3 || !tn.length) return both;
    /* anchorOffset counts children when the caret sits on the element rather
       than inside its text, so at the end of a block it reads 1 and measuring
       character 1 would report the FIRST line. Measure the text before the
       caret instead, which is the same number whatever the anchor is. */
    const pre = document.createRange();
    pre.selectNodeContents(node);
    pre.setEnd(sel.anchorNode, sel.anchorOffset);
    const off = Math.max(0, Math.min(pre.toString().length, tn.length));
    const r = document.createRange();
    if (off > 0) { r.setStart(tn, off - 1); r.setEnd(tn, off); }
    else { r.setStart(tn, 0); r.setEnd(tn, 1); }
    rect = r.getClientRects()[0];
  }
  if (!rect) return both;

  // Three quarters of a line of slack: enough to be on the line, not enough to
  // reach the one after it.
  return {first: rect.top - box.top < line * 0.75,
          last: box.bottom - rect.bottom < line * 0.75};
}
