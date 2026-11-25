/* F or ⛶ in the slides window (#515): full screen, or back. A browser lets
   a window go full screen only on a click or key in it. The hint goes once
   used. */
function slideFull() {
  const deck = DECK?.deck;
  if (!deck) return;
  const d = deck.ownerDocument;
  if (d.fullscreenElement) { d.exitFullscreen?.().catch(() => {}); return; }
  deck.requestFullscreen?.().then(() => {
    deck.querySelector(".deckfull")?.remove();
    d.defaultView.navigator.keyboard?.lock?.(["Escape"]);
  }).catch(() => {});
}
