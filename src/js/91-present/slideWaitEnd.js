// The waiting is over (#486): → opens the talk at its start.
function slideWaitEnd() {
  const w = DECK?.wait;
  if (!w) return;
  clearInterval(w.tick);
  DECK.wait = null;
  const {deck} = DECK;
  deck.classList.remove("waiting");
  for (const n of deck.querySelectorAll(".waitband, .waitdots, .slide")) n.remove();
  presentGo(0);
}
