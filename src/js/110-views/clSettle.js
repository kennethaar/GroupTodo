/* An answer given in a box lands after the box closes: the line has changed
   its words or got a state, and is dealt then. Run before the deck is drawn. */
function clSettle() {
  const p = CL.pending;
  if (!p) return;
  let b = null;
  if (V.pages.has(p.path)) walkBlocks(getPage(p.path).blocks, x => { if (x.id === p.id) b = x; });
  if (!b) CL.pending = null;
  else if (b.title !== p.title || b.state !== p.state) {
    if (dayCandidate(b)) clDeal(p.path, b);
    CL.pending = null;
    clStampIfDone(p.path);
  }
}
