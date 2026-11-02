/* The first of them on screen, outside the pane and the dialogs. */
function helpFind(sel) {
  let nodes;
  try { nodes = document.querySelectorAll(helpSel(sel)); } catch (_) { return null; }
  const vh = window.innerHeight, vw = window.innerWidth;
  let off = null;
  for (const n of nodes) {
    if (n.closest("#pagePane, #helpMarks, #modalRoot, #toasts, .helphint")) continue;
    const r = n.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    if (r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw) return n;
    off = off || n;
  }
  return off;
}
