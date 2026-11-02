/* The table moves like a deck. The answer taken slides from its place onto
   the pile under the project, and the answers to the next question are dealt
   out from under it to their places. A new project is turned face up first. */
function solAnimate(before, now, took, prevEls, els, cells, pile) {
  if (!pile || !pile.isConnected || !pile.animate || solReduced()) return;
  if (before && before.step === now.step) return;      // the same question, drawn again
  const to = pile.getBoundingClientRect();
  const mid = b => [b.left + b.width / 2, b.top + b.height / 2];
  const [tx, ty] = mid(to);
  let wait = 420;
  if (before) {
    /* An answer that only adds to the card: the card was put down on it and
       is picked up again for the next question -- it comes back from there,
       rather than the answer flying into the card. */
    wait = 120;
    const spot = took && cells.get(took), card = pile.querySelector(".solcard");
    if (spot && spot.isConnected && card) {
      const from = spot.getBoundingClientRect(), [fx, fy] = mid(from);
      const there = "translate(" + (fx - tx) + "px," + (fy - ty) + "px) scale(" + (from.width / to.width) + ")";
      card.style.zIndex = "60";
      card.animate([
        {transform: there + " rotate(" + ((Math.random() - 0.5) * 6) + "deg)"},
        {transform: there, offset: 0.25},
        {transform: "none"},
      ], {duration: 520, easing: "cubic-bezier(.3,.6,.2,1)"}).onfinish = () => { card.style.zIndex = ""; };
      wait = 420;
    }
  } else {
    /* A new project: dealt face down from the deck off the table and turned
       over on the way, and only then its first question dealt out from under
       it -- so a new project never looks like the last one with a new
       question. It is edge-on halfway there, where the back gives way to the
       face. */
    const card = pile.querySelector(".solcard");
    if (card) {
      card.classList.add("back");
      wait = 540;
      // Off the top of the deck, when the deck is on screen.
      const deck = solShown(".soldecks .deck");
      let off = "translate(-60vw,-8vh) scale(1) rotate(-14deg)", half = "translate(-30vw,-4vh) scale(1) rotate(-7deg)";
      if (deck && deck.offsetParent) {
        const d = deck.getBoundingClientRect(), c = card.getBoundingClientRect(), [dx, dy] = mid(d), [cx, cy] = mid(c);
        off = "translate(" + (dx - cx) + "px," + (dy - cy) + "px) scale(" + (d.width / c.width) + ") rotate(0deg)";
        half = "translate(" + (dx - cx) / 2 + "px," + ((dy - cy) / 2 - 30) + "px) scale(" + (1 + d.width / c.width) / 2 + ") rotate(-5deg)";
      }
      const turn = deg => " perspective(900px) rotateY(" + deg + "deg)";
      card.animate([{transform: off + turn(0)}, {transform: half + turn(90)}],
        {duration: 240, easing: "cubic-bezier(.5,0,.9,.6)"}).onfinish = () => {
        if (!card.isConnected) return;
        card.classList.remove("back");
        card.animate([{transform: half + turn(-90)}, {transform: "translate(0px,0px) scale(1) rotate(0deg)" + turn(0)}],
          {duration: 260, easing: "cubic-bezier(.1,.4,.3,1)"});
      };
    }
  }
  let n = 0;
  for (const k of SOL_SPOTS) {
    const spot = els.get(k);
    if (!spot || !spot.isConnected) continue;
    const from = spot.getBoundingClientRect(), [fx, fy] = mid(from);
    const at = "translate(" + (tx - fx) + "px," + (ty - fy) + "px) scale(" + (to.width / from.width) + ")";
    spot.animate([
      {transform: at, opacity: 0},
      {transform: at, opacity: 1, offset: 0.1},
      {transform: "none", opacity: 1},
    ], {duration: 420, delay: wait + n++ * 60, easing: "cubic-bezier(.2,.7,.2,1)", fill: "backwards"});
  }
}
