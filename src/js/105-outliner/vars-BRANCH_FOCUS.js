/* In the capture phase, ahead of the line's own paste: with lines picked, a
   paste goes over them, not into whichever line still has the caret. */
document.addEventListener("paste", e => {
  if (!lineSelOwnsClipboard()) return;
  if (/^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
  const raw = e.clipboardData && e.clipboardData.getData("text/plain");
  if (raw == null) return;
  e.preventDefault(); e.stopPropagation();
  lineSelPaste(raw);
}, true);

/* Copy and cut from the browser's own menu, or the right-click one, take the
   picked lines too, written straight onto the clipboard. */
for (const kind of ["copy", "cut"]) document.addEventListener(kind, e => {
  if (!lineSelOwnsClipboard() || !e.clipboardData) return;
  if (/^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
  const text = lineSelText();
  if (!text) return;
  e.preventDefault(); e.stopPropagation();
  e.clipboardData.setData("text/plain", text);
  const n = LINE_SEL.ids.length;
  notify(n + (n === 1 ? " line " : " lines ") + (kind === "cut" ? "cut." : "copied."));
  if (kind === "cut") lineSelRemove(null); else lineSelClear();
}, true);

/* Pressing anywhere else lets the handful go -- except on the bar that is
   there to act on it. */
document.addEventListener("mousedown", e => {
  if (!LINE_SEL.ids.length) return;
  if (e.target.closest("#lselHud")) return;
  // A right click opens the menu that copies them: the pick has to outlast it.
  if (e.button === 2 && e.target.closest?.(".blk.lsel")) return;
  // Ctrl on a line adds it to the pick, which attachLineSelect has just done.
  if ((e.ctrlKey || e.metaKey) && e.defaultPrevented) return;
  lineSelClear();
});

/* A double click picks the word alone. Windows hands back the space after it
   too, so typing over the word would swallow the gap to the next one. */
document.addEventListener("dblclick", e => {
  const t = e.target;
  if (/^(INPUT|TEXTAREA)$/.test(t.tagName)) {
    try {
      const {selectionStart: a, selectionEnd: b, value} = t;
      const s = value.slice(a, b), n = s.length - s.trimEnd().length;
      if (n && n < s.length) t.setSelectionRange(a, b - n);
    } catch {}                           // number and date fields keep no selection
    return;
  }
  const sel = getSelection();
  if (!sel || !sel.rangeCount) return;
  const r = sel.getRangeAt(0), s = r.toString(), n = s.length - s.trimEnd().length;
  if (!n || n === s.length || r.endContainer.nodeType !== 3 || r.endOffset < n) return;
  sel.setBaseAndExtent(r.startContainer, r.startOffset, r.endContainer, r.endOffset - n);
});

/* ---------- focus ----------
   Clicking a bullet focuses on that line and what hangs under it: everything
   else leaves the column and only the trail back out stays above it. It is a
   view filter only; the tree in the file is untouched. One line at a time, in
   one outline at a time, and Back walks out of it like any other move. */
const BRANCH_FOCUS = new WeakMap();
let FOCUSED = null;                      // {page, path, space}
