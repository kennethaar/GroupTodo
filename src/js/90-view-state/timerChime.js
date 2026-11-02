function timerChime(times) {
  try {
    const ac = timerAudio();
    if (!ac) return;
    const out = ac.createDynamicsCompressor(), level = ac.createGain();
    try { TIMER_RING?.disconnect(); } catch (_) {}
    TIMER_RING = level;
    level.gain.value = timerVolume();
    out.connect(level); level.connect(ac.destination);
    const gap = 0.8;
    for (let i = 0; i < times; i++) {
      const t0 = ac.currentTime + 0.05 + i * gap, f = i % 2 ? 784 : 988;
      for (const [mul, vol, len] of [[1, 1, 1.6], [2.76, 0.5, 0.9], [5.4, 0.25, 0.5], [0.5, 0.35, 1.8]]) {
        const o = ac.createOscillator(), g = ac.createGain();
        o.type = "sine"; o.frequency.value = f * mul;
        o.connect(g); g.connect(out);
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(vol, t0 + 0.008);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + len);
        o.start(t0); o.stop(t0 + len + 0.05);
      }
    }
    setTimeout(() => { if (TIMER_RING === level) { level.disconnect(); TIMER_RING = null; } }, (times * gap + 2.5) * 1000);
  } catch (_) {}
}
