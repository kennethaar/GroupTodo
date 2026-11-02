/* Picking cards is the one thing on the board that must NOT redraw the screen.
   A redraw rebuilds every column, which puts the scroll back to the top of each
   one -- and picking out eight cards means scrolling, so a redraw per pick made
   the whole thing useless. Nothing on disk changed, so nothing needs rebuilding:
   the outline goes on and off the cards that are already there, and the count at
   the top is rewritten in place. */
function paintBoardSel() {
  for (const card of $$(".bcard[data-selid]")) {
    card.classList.toggle("sel", boardSelHas(card.dataset.selkind, card.dataset.selid));
  }
  const host = $("#bselHost");
  if (host) {
    host.textContent = "";
    const bar = boardSelBar();
    if (bar) host.append(bar);
  }
}
