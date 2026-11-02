/* Letting go: on a pill, that pill; on a text box, its box is typed in; on an
   answered card, it comes back to be changed. A pill that only adds to the
   card sends the card back to the mat; answering the last field or a deck
   operation deals the next card. */
function solDragEnd(drop) {
  const d = SOL_DRAG; SOL_DRAG = null;
  if (!d) return;
  clearTimeout(d.moreT);
  if (!d.ghost) return;
  d.card.classList.remove("dragging");
  const box = solBox(d.k);
  solUnpaint();
  const r = SOL.order && SOL.order[SOL.i];
  const hit = drop && box && r && solInside(box.getBoundingClientRect(), d.x, d.y);
  solGhostHome(d.ghost, null);
  if (hit) solTake(r, box);
}
