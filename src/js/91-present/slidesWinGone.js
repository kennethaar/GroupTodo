// The slides window closed by hand ends the talk (#515).
function slidesWinGone() {
  SLIDES_WIN = null;
  if (DECK?.win) presentStop();
}
