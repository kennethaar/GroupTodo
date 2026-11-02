function timerSilence() {
  try { TIMER_RING?.disconnect(); } catch (_) {}
  TIMER_RING = null;
  if (TIMER_FLASH) { clearInterval(TIMER_FLASH); TIMER_FLASH = null; document.title = TIMER_TITLE; }
  for (const sel of ["#brand", "#nav .nav-item.timer"]) $(sel)?.classList.remove("timerpulse");
}
