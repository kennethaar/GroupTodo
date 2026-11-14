/* A line ended with Enter: written back, its new line made, not yet drawn.
   A folder waiting to take over from the browser copy does it now, so the
   draw that follows is the folder's, with the caret on the new line (#181).
   Waiting for the line to be left held the folder back for as long as you
   captured, line after line. */
let LINE_DONE = null;
function lineDone() {
  const go = LINE_DONE;
  if (go) { LINE_DONE = null; go(); }
}
