/* True when the key belonged to the menu rather than the line. */
function flyKey(e) {
  if (!FLY || FLY.txt !== e.target) return false;
  if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey && FLY_KEYS[e.code]) {
    e.preventDefault(); e.stopImmediatePropagation();
    const k = FLY_KEYS[e.code];
    // Alt+R goes straight to the Repeats dialog.
    if (k === "rep") { flyPick("rep", "\u0002"); return true; }
    if (!["kind", "task", "note"].includes(k)) { FLY_LIT = {id: FLY.block.id, k}; }
    flyHead(k);
    if (FLY) flyDraw();
    return true;
  }
  if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && e.code === "Period") {
    e.preventDefault(); e.stopImmediatePropagation();
    flySummon(FLY.txt);
    return true;
  }
  // ← → switch the slide preview beside Present from here (#465); ↑ ↓ move between rows.
  // Enter after them opens the talk at the slide shown.
  if (FLY.summoned && SLIDE_PEEK?.anchor.classList.contains("frow")) {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      SLIDE_PEEK.keyed = true;
      slidePeekPick(SLIDE_PEEK.on + (e.key === "ArrowLeft" ? -1 : 1));
      return true;
    }
    if (e.key === "Enter" && SLIDE_PEEK.keyed) { e.preventDefault(); slidePeekGo(); return true; }
  }
  /* Asked for, the menu's rows take the arrows until one is opened. */
  if (FLY.summoned && !FLY.open) {
    const rows = flyRows().filter(r => r.menu);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      FLY.row = ((FLY.row || 0) + (e.key === "ArrowUp" ? -1 : 1) + rows.length) % rows.length;
      flyDraw(); return true;
    }
    if (e.key === "Enter") { e.preventDefault(); flyHead(rows[FLY.row || 0].k); return true; }
    if (e.key === "Escape") { e.preventDefault(); FLY.summoned = false; flyDraw(); return true; }
    return false;
  }
  if (!FLY.open) return false;
  const r = flyRows().find(x => x.k === FLY.open);
  const os = r ? flyOptsOf(r) : [];
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    if (os.length) FLY.hi = ((FLY.hi || 0) + (e.key === "ArrowUp" ? -1 : 1) + os.length) % os.length;
    flyDraw(); return true;
  }
  if (e.key === "Enter") { e.preventDefault(); if (os.length) flyPick(FLY.open, os[Math.min(FLY.hi || 0, os.length - 1)][0]); return true; }
  if (e.key === "Escape") { e.preventDefault(); FLY.open = null; flyDraw(); return true; }
  return false;
}
