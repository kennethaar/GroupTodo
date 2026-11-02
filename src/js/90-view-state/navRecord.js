/* Arriving somewhere by walking the history is not a new place, so a jump
   records nothing -- otherwise Back would push the thing you just left and
   the trail would never end. */
function navRecord() {
  if (NAV_JUMPING) return;
  const now = navSnapshot();
  if (navSame(NAV_HIST[NAV_AT], now)) return;
  NAV_HIST = NAV_HIST.slice(0, NAV_AT + 1);
  NAV_HIST.push(now);
  if (NAV_HIST.length > 80) NAV_HIST.shift();
  NAV_AT = NAV_HIST.length - 1;
  syncNavArrows();
}
