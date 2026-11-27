// The presenter's timer and clock, once a second; and the time Alt shows on the slide (#485).
function presenterTick() {
  if (!DECK) return;
  const at = DECK.deck.querySelector(".arrtime");
  if (at) at.textContent = "⏱ " + slideTalkTime();
  const pw = DECK.pw;
  if (!pw || pw.closed) return;
  const two = n => String(n).padStart(2, "0");
  const timer = pw.document.querySelector(".ptimer"), clock = pw.document.querySelector(".pclock");
  if (timer) timer.textContent = slideTalkTime();
  const now = new Date();
  if (clock) clock.textContent = now.getHours() + ":" + two(now.getMinutes());
}
