/* Ticks while it runs, and on after it rings so the time since keeps counting.
   A timer that ran out while the app was closed rings on the first tick. */
function timerRun() {
  clearInterval(TIMER_TICK);
  TIMER_TICK = setInterval(() => {
    if (timerLeft() > 0 || !TIMER_END) return timerPaint();
    const mins = Math.round(TIMER_LEN / 60000);
    TIMER_DUE = TIMER_END;
    safeLS.set("gtd.timerDue", String(TIMER_DUE));
    timerStop();
    timerDone(mins);
  }, 1000);
  timerPaint();
}
