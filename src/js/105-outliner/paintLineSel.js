/* Like the board's selection, this is painted onto the lines already on screen
   rather than redrawn: a redraw would take the caret and the scroll with it. */
function paintLineSel() {
  for (const n of $$(".blk.lsel")) n.classList.remove("lsel");
  for (const id of LINE_SEL.ids) {
    const n = $('.blk[data-id="' + id + '"]');
    if (n) n.classList.add("lsel");
  }
  lineSelHud();
}
