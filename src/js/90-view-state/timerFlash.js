function timerFlash() {
  timerRipple();
  if (!TIMER_FLASH) TIMER_TITLE = document.title;
  clearInterval(TIMER_FLASH);
  let n = 0;
  TIMER_FLASH = setInterval(() => {
    document.title = n % 2 ? TIMER_TITLE : "\u23F0 Time is up";
    if (++n >= 20) { clearInterval(TIMER_FLASH); TIMER_FLASH = null; document.title = TIMER_TITLE; timerPaint(); }
  }, 600);
  for (const sel of ["#brand", "#nav .nav-item.timer"]) {
    const t = $(sel);
    if (!t) continue;
    t.classList.remove("timerpulse");
    void t.offsetWidth;            // restart the animation if it is still going
    t.classList.add("timerpulse");
    t.addEventListener("animationend", () => t.classList.remove("timerpulse"), {once: true});
  }
}
