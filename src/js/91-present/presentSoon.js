/* An edit on the page shows on the slides in their own window (#515): a
   moment after the last change, the talk is drawn again at the same line. */
function presentSoon() {
  if (!DECK?.win) return;
  clearTimeout(SLIDES_SOON);
  SLIDES_SOON = setTimeout(presentRefresh, 300);
}
