/* The alarm clicked away: silent, and the time since it rang is no longer shown. */
function timerAck() {
  timerSilence();
  TIMER_DUE = 0;
  safeLS.del("gtd.timerDue");
  if (!TIMER_END) { clearInterval(TIMER_TICK); TIMER_TICK = null; }
  timerPaint();
}
