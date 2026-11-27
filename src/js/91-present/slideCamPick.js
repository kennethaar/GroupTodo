/* The camera's mode for this slide (#485), from C or the presenter window's
   Camera strip; null gives the slide back to Auto. The next slide is Auto. */
function slideCamPick(mode) {
  const c = DECK?.cam, here = DECK?.steps[DECK.i];
  if (!c || !here) return;
  c.pick = mode ? {s: here.s, mode} : null;
  slideCamShow();
  presenterDraw();
}
