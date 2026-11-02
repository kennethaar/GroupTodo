/* An arrow that cannot do anything says so by being grey rather than by doing
   nothing when pressed. The first redraw seeds the trail with wherever the app
   opened, so the first Back has something to come back from. */
function syncNavArrows() {
  if (!NAV_HIST.length && !NAV_JUMPING) { NAV_HIST = [navSnapshot()]; NAV_AT = 0; }
  const b = $("#btnBack"), f = $("#btnFwd");
  if (!b || !f) return;
  b.disabled = NAV_AT <= 0;
  f.disabled = NAV_AT >= NAV_HIST.length - 1;
  b.title = "Back (alt+←)" + (b.disabled ? "" : " · " + navWhere(NAV_HIST[NAV_AT - 1]));
  f.title = "Forward (alt+→)" + (f.disabled ? "" : " · " + navWhere(NAV_HIST[NAV_AT + 1]));
}
