function timerStart(minutes, sound = true) {
  timerAck();
  // Asked from the click that starts a timer, which is when browsers allow it.
  try { if (window.Notification?.permission === "default") Notification.requestPermission(); } catch (_) {}
  if (sound) timerAudio();
  TIMER_SOUND = sound;
  safeLS.set("gtd.timerSound", sound ? "1" : "0");
  TIMER_LEN = minutes * 60000;
  TIMER_END = Date.now() + TIMER_LEN;
  safeLS.set("gtd.timerEnd", String(TIMER_END));
  safeLS.set("gtd.timerLen", String(TIMER_LEN));
  timerRun();
}
