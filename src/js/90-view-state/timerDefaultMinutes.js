function timerDefaultMinutes() {
  const raw = getPage(TIMER_PATH)?.props?.minutes;
  const n = parseFloat(String(raw ?? "").replace(",", "."));
  return n > 0 ? Math.min(n, timerMax()) : 2;
}
