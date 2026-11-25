// The slide on screen drawn again with its kept places (#487).
function slideArrRedraw() {
  const cur = DECK?.deck.querySelector(".slide.cur"), here = DECK?.steps[DECK.i];
  if (!cur || !here) return;
  slideArrApply(cur, here.s);
  // A map's pins stand anew at their places (#488).
  const pins = cur.querySelector(".mpins");
  // A picture pin's picture from the folder is loaded again.
  if (pins) { pins.replaceWith(drawMapPins(here.s)); slideMapPins(cur, here); resolveAssets(cur.querySelector(".mpins")); }
}
