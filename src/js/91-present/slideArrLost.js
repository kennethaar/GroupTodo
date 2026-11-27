/* The dashed boxes of Alt held (#487) go when Alt is no longer held: the
   window loses focus (Alt+Tab to the presenter window never lets go of Alt
   here), or a key or a move comes without Alt. */
function slideArrLost(e) {
  if (!DECK?.deck.classList.contains("arranging")) return;
  if (e.type === "blur" || !e.altKey) slideArrShow(false);
}
