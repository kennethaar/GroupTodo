/* On a phone a long line wraps as you type, and the caret goes down onto the
   new row, under the keyboard or the line toolbar, where the browser does not
   look for it. The page moves just enough to keep it in sight (#389). */
function keepCaretInSight(host) {
  const c = $("#content");
  if (!c || !touchFirst() || document.activeElement !== host) return;
  const {top, bot} = typingBand(c), r = caretScreenRect(host), gap = 8;
  if (r.bottom > bot - gap) c.scrollTop += Math.ceil(r.bottom - bot + gap);
  else if (r.top < top + gap) c.scrollTop -= Math.ceil(top + gap - r.top);
}
