/* Once a second on the waiting screen (#486): the countdown in the band, in
   the presenter window too, and the next waiting slide when its time is up.
   At the start time it says so and waits: the talk starts on → only. */
function slideWaitTick() {
  const w = DECK?.wait;
  if (!w) return;
  const left = Math.max(0, Math.ceil((w.at - Date.now()) / 1000));
  const two = n => String(n).padStart(2, "0");
  const clock = left >= 3600 ? Math.floor(left / 3600) + ":" + two(Math.floor(left / 60) % 60) + ":" + two(left % 60)
    : Math.floor(left / 60) + ":" + two(left % 60);
  const band = DECK.deck.querySelector(".waitband");
  if (band) {
    band.classList.toggle("soon", left * 1000 <= SLIDE_WAIT_SOON);
    band.querySelector(".waitwhen").textContent = left ? "Starts at " + w.text : "Starting now";
    band.querySelector(".waitclock").textContent = left ? clock : "";
  }
  const pw = DECK.pw;
  const own = pw && !pw.closed && pw.document.querySelector(".pwait");
  if (own) own.textContent = left ? "Starts at " + w.text + " · " + clock : "Starting now";
  if (w.slides.length > 1 && Date.now() - w.shown >= SLIDE_WAIT_EVERY) slideWaitNext();
}
