function timerStop() {
  TIMER_END = 0;
  safeLS.del("gtd.timerEnd");
  if (!TIMER_DUE) { clearInterval(TIMER_TICK); TIMER_TICK = null; }
  timerPaint();
}
