/* #428 The line under the pointer, for squigglePaint. The caret's line
   follows the selection, typing included. */
let SQUIGGLE_HOVER = null;
document.addEventListener("mouseover", e => {
  const t = e.target.closest ? e.target.closest(".blk > .line > .txt") : null;
  if (t === SQUIGGLE_HOVER) return;
  SQUIGGLE_HOVER = t;
  squigglePaint();
});
document.addEventListener("selectionchange", () => squigglePaint());
document.addEventListener("focusout", () => setTimeout(squigglePaint, 0));
