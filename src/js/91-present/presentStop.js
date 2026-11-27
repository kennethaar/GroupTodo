/* Leave the slides: the page again, with the caret back in its line, and an
   offer of the line the talk ended at (#515). `quiet`: a new talk takes over. */
function presentStop(quiet = false) {
  if (!DECK) return;
  const {deck, back, timer, pw, path, root, i, wait, win} = DECK, w = win || window;
  if (wait) clearInterval(wait.tick);
  slideCamOff();       // the camera's light goes out with the talk (#485)
  const lastStep = DECK.seen || DECK.steps[i];
  DECK = null;
  // Where you left it, for the preview on ▶ Present (#465).
  if (i >= 0) slideLast(path, root, i);
  clearInterval(timer);
  w.removeEventListener("keydown", presentKey, true);
  w.removeEventListener("keyup", slideArrKey, true);
  w.removeEventListener("blur", slideArrLost);
  w.removeEventListener("pointermove", slideArrLost, true);
  win?.removeEventListener("pagehide", slidesWinGone);
  clearTimeout(SLIDES_SOON);
  SLIDE_ARR_PICK = null;
  try { navigator.keyboard?.unlock?.(); } catch (e) {}
  const doc = deck.ownerDocument;
  if (doc.fullscreenElement) doc.exitFullscreen?.().catch(() => {});
  deck.remove();
  // The slides window stays, to show the next talk (#515).
  if (win && !win.closed) {
    try { win.document.body.replaceChildren(el("p", {class: "slidesend"}, "The talk has ended. ▶ Present on the page shows it here again.")); } catch (e) {}
  }
  if (pw && !pw.closed) {
    try { pw.document.body.replaceChildren(el("p", {class: "pend"}, "The slides are closed.")); } catch (e) {}
  }
  if (back && back.isConnected && back.focus) back.focus({preventScroll: true});
  if (!quiet) presentEndOffer(path, lastStep, back);
}
