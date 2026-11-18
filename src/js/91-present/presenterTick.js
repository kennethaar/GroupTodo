// The presenter's timer and clock, once a second.
function presenterTick() {
  const pw = DECK?.pw;
  if (!pw || pw.closed) return;
  const t = Math.floor((Date.now() - DECK.t0) / 1000);
  const two = n => String(n).padStart(2, "0");
  const timer = pw.document.querySelector(".ptimer"), clock = pw.document.querySelector(".pclock");
  if (timer) timer.textContent = (t >= 3600 ? Math.floor(t / 3600) + ":" + two(Math.floor(t / 60) % 60) : Math.floor(t / 60)) + ":" + two(t % 60);
  const now = new Date();
  if (clock) clock.textContent = now.getHours() + ":" + two(now.getMinutes());
}
