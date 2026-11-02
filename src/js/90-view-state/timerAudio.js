function timerAudio() {
  try {
    TIMER_AUDIO ??= new (window.AudioContext || window.webkitAudioContext)();
    if (TIMER_AUDIO.state !== "running") TIMER_AUDIO.resume().catch(() => {});
  } catch (_) {}
  return TIMER_AUDIO;
}
