/* from: the ☰ that was clicked, so the menu opens beside it (#413);
   Ctrl+. has none and opens it at the end of the words. */
function flySummon(txt, from = null) {
  if (!FLY || FLY.txt !== txt) { txt.focus(); if (!FLY || FLY.txt !== txt) return; }
  FLY.summoned = !FLY.summoned; FLY.open = null; FLY.row = 0;
  FLY.from = FLY.summoned ? from : null;
  flyDraw();
}
