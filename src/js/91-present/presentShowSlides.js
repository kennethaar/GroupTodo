/* ▶ Start presentation in the presenter window (#515): the slides window,
   opened from there. A browser lets one pop-up through per click, so With
   presenter window opens the presenter window and this opens the slides,
   where the presenter window is. The page stays as it is. */
function presentShowSlides() {
  if (!DECK?.later) return;
  const pw = DECK.pw && !DECK.pw.closed ? DECK.pw : window;
  const host = slidesWinOpen(DECK.path, {from: pw});
  if (!host) return;
  presentHost(host);
  if (!DECK.wait) presentGo(DECK.i);
  presenterDraw();
}
