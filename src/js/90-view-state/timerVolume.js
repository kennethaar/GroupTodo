/* volume:: on the same page, 0 to 100; 30 if it says nothing. */
function timerVolume() {
  const n = parseFloat(String(getPage(TIMER_PATH)?.props?.volume ?? "").replace(",", "."));
  return (n >= 0 ? Math.min(n, 100) : 30) / 100;
}
