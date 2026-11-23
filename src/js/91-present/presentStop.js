/* Leave the slides: the page again, with the caret back in its line. */
function presentStop() {
  if (!DECK) return;
  const {deck, back, timer, pw, path, root, i, wait} = DECK;
  if (wait) clearInterval(wait.tick);
  DECK = null;
  // Where you left it, for the preview on ▶ Present (#465).
  if (i >= 0) slideLast(path, root, i);
  clearInterval(timer);
  window.removeEventListener("keydown", presentKey, true);
  try { navigator.keyboard?.unlock?.(); } catch (e) {}
  if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
  deck.remove();
  if (pw && !pw.closed) {
    try { pw.document.body.replaceChildren(el("p", {class: "pend"}, "The slides are closed.")); } catch (e) {}
  }
  if (back && back.isConnected && back.focus) back.focus({preventScroll: true});
}
