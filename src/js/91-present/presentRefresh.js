/* The talk drawn again from the page (#515), staying on the line it was
   on; a line taken away leaves it at the same step. Not while a line is
   edited on the slide or the waiting screen shows. */
function presentRefresh() {
  if (!DECK || DECK.edit || DECK.wait) return;
  const idOf = st => st && (st.k ? st.s.parts[st.k - 1] : st.s.block)?.id;
  const id = idOf(DECK.steps[DECK.i]);
  Object.assign(DECK, deckSteps(DECK.path, DECK.root, DECK.on));
  let i = id ? DECK.steps.findIndex(st => idOf(st) === id) : -1;
  if (i < 0) i = Math.max(0, Math.min(DECK.i, DECK.steps.length - 1));
  DECK.i = -1;
  DECK.deck.querySelector(".slide.cur")?.remove();
  presentGo(i);
}
