function holdRender(fn) {
  RENDER_HOLD++;
  try { fn(); } finally {
    RENDER_HOLD--;
    if (!RENDER_HOLD && RENDER_MISSED) { RENDER_MISSED = false; render(); }
  }
}
