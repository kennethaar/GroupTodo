/* #408 A round every ten seconds while the app is in sight, and one at
   once on coming back to it. */
function installHere() {
  if (HERE.timer) return;
  const tick = () => { if (document.visibilityState === "visible") hereRound(); };
  HERE.timer = setInterval(tick, HERE_BEAT_MS);
  document.addEventListener("visibilitychange", tick);
  tick();
}
