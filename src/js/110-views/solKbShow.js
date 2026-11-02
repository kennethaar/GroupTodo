/* ---------- the keyboard ----------
   Each numpad key is one box, where it sits on the table, and the number row
   does the same. A number aims at its box; the same number again takes it.
   From the card the arrows aim at the box on that side, and from a box at the
   next box that way. A letter aims at the answer starting with it. Enter or
   Space takes the one aimed at; Esc (or 5) goes back to the card, 5 twice
   skips the project. Shift+Right flings the card on to the next. */
function solKbShow(quiet = false) {
  const box = solBox(SOL_KB && SOL_KB.k);
  if (!box) { solUnpaint(); return; }
  solPaint(SOL_KB.k, null, {quiet});
  const card = solCardEl();
  if (card) solArrow(card, box, solPillWord(box, box)); else solArrow(null);
}
