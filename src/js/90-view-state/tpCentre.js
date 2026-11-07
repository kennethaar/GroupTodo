/* Bring a paragraph to the middle of the screen (#324): the line the caret is
   on when it is in there, else the paragraph's middle, or its top when it is
   taller than half the screen. It slides there; instant jumps at once. */
function tpCentre(node, instant) {
  const box = $("#content");
  if (!node || !box || !node.isConnected) return;
  const r = box.getBoundingClientRect(), mid = r.top + r.height / 2;
  const nr = node.getBoundingClientRect();
  let y = null;
  const sel = getSelection();
  if (sel.rangeCount && node.contains(sel.getRangeAt(0).startContainer)) {
    const rg = sel.getRangeAt(0), rc = rg.getClientRects()[0] || rg.getBoundingClientRect();
    if (rc && rc.height) y = rc.top + rc.height / 2;
  }
  if (y === null) y = nr.height > r.height / 2 ? nr.top + 16 : nr.top + nr.height / 2;
  const d = y - mid;
  if (Math.abs(d) < 2) return;
  if (instant) { cancelAnimationFrame(TELEPROMPT.glide); TELEPROMPT.glide = 0; box.scrollTop += d; }
  else tpGlide(box, box.scrollTop + d);
}
