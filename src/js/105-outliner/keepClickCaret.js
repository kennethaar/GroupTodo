/* ---------- the caret where the line was clicked ----------
   A line is drawn with its links as names and its contexts as @words, and
   turns into its raw text as it takes focus. The browser then puts the caret
   where the mouse is over the raw text, which is somewhere else in it: a
   click after "@office" landed inside "[[c/office]]". So the spot is read off
   the line as drawn, found again in the raw text, and the caret moved there
   once the click is over. A drag that selects is left alone (#138). */
function keepClickCaret(host, raw) {
  let want = null;
  host.addEventListener("mousedown", e => {
    want = e.button === 0 && !e.defaultPrevented && document.activeElement !== host
      ? rawOffsetAt(host, e.clientX, e.clientY, raw()) : null;
  });
  host.addEventListener("mouseup", () => {
    const at = want, sel = getSelection(), tn = host.firstChild;
    want = null;
    if (at == null || document.activeElement !== host || !sel || !sel.isCollapsed || !tn || tn.nodeType !== 3) return;
    const r = document.createRange();
    r.setStart(tn, Math.min(at, tn.length)); r.collapse(true);
    sel.removeAllRanges(); sel.addRange(r);
  });
}
