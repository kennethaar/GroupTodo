/* At start (#492): the Journal may offer where you left off, until you go
   somewhere. Not when a link opened the app: it goes where it points. A
   caret moved to another line counts as a new place too, and the place is
   kept before the page is hidden or closed. */
function lastPlaceStart() {
  LAST_PLACE_OFFER = LINK_OPENING ? null : true;
  if (lastPlaceStart.on) return;
  lastPlaceStart.on = true;
  document.addEventListener("focusin", e => { if (e.target.closest?.("#content .blk")) lastPlaceSave(); });
  const flush = () => { if (LAST_PLACE_TIMER) lastPlaceSave(true); };
  document.addEventListener("visibilitychange", () => { if (document.hidden) flush(); });
  window.addEventListener("pagehide", flush);
}
