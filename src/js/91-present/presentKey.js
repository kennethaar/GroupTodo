/* The keys while presenting, in either window. → Space PageDown or a clicker
   go on, ← goes back, Esc goes up a level and leaves at the top, Shift+→
   skips the rest of the slide. A number and Enter jumps to that slide. Every
   other key is kept from the page under it, so nothing gets typed there. */
function presentKey(e) {
  // Alt shows what can be placed; Alt+arrows nudge what Alt+click picked (#487).
  if (slideArrKey(e)) return;
  // A line being edited on the slide (#466) gets its keys; its field handles Enter and Esc.
  if (!DECK || DECK.edit || e.ctrlKey || e.metaKey || e.altKey || /^F\d+$/.test(e.key)) return;
  e.preventDefault(); e.stopImmediatePropagation();
  // The waiting screen (#486): → or Space starts the talk, Esc leaves, P opens the presenter window.
  if (DECK.wait) {
    if (["ArrowRight", "ArrowDown", "PageDown", " ", "Enter", "n"].includes(e.key)) slideWaitEnd();
    else if (e.key === "Escape") presentStop();
    else if (e.key.toLowerCase() === "p") presenterOpen();
    return;
  }
  const {steps, slides} = DECK, here = steps[DECK.i], k = e.key;
  if (/^\d$/.test(k)) { DECK.digits = (DECK.digits + k).slice(-3); return; }
  const digits = DECK.digits;
  DECK.digits = "";
  if (k === "Enter" && digits) { const s = slides[+digits - 1]; if (s) presentGo(s.first); return; }
  if (k === "Escape") {
    if (DECK.grid) { DECK.grid = false; presenterDraw(); }
    else if (here.s.depth > 0) presentGo(here.s.first - 1);
    else presentStop();
    return;
  }
  if (k === "ArrowRight" && e.shiftKey) { if (here.s.end < steps.length) presentGo(here.s.end); return; }
  if (["ArrowRight", "ArrowDown", "PageDown", " ", "Enter", "n"].includes(k)) return presentGo(DECK.i + 1);
  if (["ArrowLeft", "ArrowUp", "PageUp", "Backspace"].includes(k)) return presentGo(DECK.i - 1);
  if (k === "Home") return presentGo(0);
  if (k === "End") return presentGo(steps.length - 1);
  const low = k.toLowerCase();
  if (low === "b" || k === ".") DECK.deck.classList.toggle("blank");
  else if (low === "p") presenterOpen();
  else if (low === "o") { if (!DECK.pw || DECK.pw.closed) presenterOpen(); DECK.grid = !DECK.grid; presenterDraw(); }
}
