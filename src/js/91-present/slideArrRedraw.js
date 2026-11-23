// The slide on screen drawn again with its kept places (#487).
function slideArrRedraw() {
  const cur = DECK?.deck.querySelector(".slide.cur"), here = DECK?.steps[DECK.i];
  if (cur && here) slideArrApply(cur, here.s);
}
