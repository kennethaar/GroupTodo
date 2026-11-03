/* The bell: the alarm on or off, for the timer that runs and the next one.
   The time left is not touched. */
function timerSoundToggle() {
  TIMER_SOUND = !TIMER_SOUND;
  safeLS.set("gtd.timerSound", TIMER_SOUND ? "1" : "0");
  if (TIMER_SOUND) timerAudio();
  timerPaint();
}
