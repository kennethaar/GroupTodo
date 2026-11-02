function flySummon(txt) {
  if (!FLY || FLY.txt !== txt) { txt.focus(); if (!FLY || FLY.txt !== txt) return; }
  FLY.summoned = !FLY.summoned; FLY.open = null; FLY.row = 0;
  flyDraw();
}
