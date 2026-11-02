/* The card goes off the table onto where it now belongs: the stack it was
   sorted onto, the done pile beside the deck, or -- skipped -- back under the
   deck. An answer that is not a stack slides into the card first. The other
   answers stay where they are: the next card is asked the same question, so
   gathering them up only to deal the same hand straight back out was the
   deck dealt twice. */
function solSweep(done0, {skip = false} = {}) {
  /* Nothing is answered while a card is on its way off the table: a key
     pressed for the next card would land on this one, change its status
     back, and deal past the next project unasked. */
  if (SOL.moving) return;
  const sol = SOL;
  sol.moving = true;
  const done = () => { sol.moving = false; done0(); };
  const pile = document.querySelector(".sol .solpile");
  SOL.keepHand = true;
  if (!pile || !pile.animate || solReduced()) { done(); return; }
  pile.parentNode.style.pointerEvents = "none";
  const mid = b => [b.left + b.width / 2, b.top + b.height / 2];
  const to = pile.getBoundingClientRect(), [tx, ty] = mid(to);
  const took = !skip && SOL.took && SOL.els && SOL.els.get(SOL.took);
  const onto = took && took.isConnected && took.classList.contains("stack") ? took
    : solShown(skip ? ".soldecks .deck" : ".soldecks .donepile");
  // The project is what moves: nothing flies into it, it goes onto its stack.
  const wait = 0;
  if (onto === took) SOL.landed = SOL.took;
  const card = pile.querySelector(".solcard") || pile;
  if (!onto || !onto.isConnected) {
    card.animate([{transform: "none", opacity: 1}, {transform: "translateY(-14px) scale(.9) rotate(-4deg)", opacity: 0}],
      {duration: 320, delay: wait, easing: "ease-in", fill: "forwards"}).onfinish = done;
    return;
  }
  const from = card.getBoundingClientRect(), [fx, fy] = mid(from), at = onto.getBoundingClientRect(), [ox, oy] = mid(at);
  const go = "translate(" + (ox - fx) + "px," + (oy - fy) + "px) scale(" + (at.width / from.width) + ")";
  Object.assign(card.style, {zIndex: "60"});
  card.animate([
    {transform: "none", opacity: 1},
    {transform: go + " rotate(" + ((Math.random() - 0.5) * 6) + "deg)", opacity: 1, offset: 0.85},
    {transform: go, opacity: 0},
  ], {duration: 520, delay: wait, easing: "cubic-bezier(.45,0,.25,1)", fill: "forwards"}).onfinish = done;
}
