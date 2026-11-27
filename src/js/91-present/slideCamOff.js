// The camera off for the rest of the talk, or as the talk ends (#485).
function slideCamOff() {
  const c = DECK?.cam;
  if (!c) return;
  clearTimeout(c.timer);
  c.stream.getTracks().forEach(t => t.stop());
  c.video.remove();
  c.pv?.remove();
  DECK.cam = null;
  const deck = DECK.deck;
  delete deck.dataset.cam;
  deck.classList.remove("camwide");
  for (const s of deck.querySelectorAll(".slide.camside")) s.classList.remove("camside");
}
