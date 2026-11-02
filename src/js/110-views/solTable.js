/* The table itself, whichever deck is on it: the card in the middle (`face`),
   the answers to its question dealt round it, and the deck beside them. */
function solTable(c, pass, r, steps, f, done, face) {
  /* Every answered question is a card on the pile under the project, so the
     pile is the progress. */
  const key = solKey(r);
  /* The same project, even when an answer has just moved its page to another
     folder and the redraw on the way past sees it under a new path. */
  const before = SOL.shown && (SOL.shown.key === key || SOL.shown.r === r) ? SOL.shown : null;
  // The answer taken stays known until the card leaves the table with it.
  const took = SOL.took;
  if (!before || before.step !== (f ? f.k : null)) SOL.took = null;
  /* A card answered in full is about to leave the table: the answers to its
     last question stay out meanwhile, as the stack it is going onto. */
  const hand = f || (before && before.asked && steps.find(s => s.k === before.asked)) || null;
  const acts = hand ? solDeal(r, hand) : [];
  SOL_ACTS = new Map();
  const els = new Map(), cells = new Map();
  acts.forEach((a, i) => { a.k = SOL_SPOTS[i]; SOL_ACTS.set(a.k, a); });
  // Sorting by status: each answer is a stack the sorted projects lie on.
  const tally = hand && hand.k === "status" ? solStatusTally() : hand && hand.k === "still" ? actStillTally() : null;
  if (tally) for (const a of acts) if (a.v != null && (hand.k !== "still" || ACT_STACKS.includes(a.v))) a.pile = tally[a.v] || 0;
  let pile = null;
  const grid = el("div", {class: "sol", data: {step: f ? f.k : ""}});
  SOL_GRID.forEach((g, gi) => {
    const [ox, oy] = SOL_ORIGIN(gi);
    if (g !== "CARD") {
      const a = SOL_ACTS.get(g);
      const s = a ? solActBox(r, a) : el("div", {class: "slot solempty", "aria-hidden": "true"});
      if (a) { s.dataset.dox = ox; s.dataset.doy = oy; solOrigin(s, ox, oy); els.set(g, s); }
      cells.set(g, s);
      grid.append(s);
      return;
    }
    pile = el("div", {class: "solpile", title: done + " of " + steps.length + " answered"},
      ...Array.from({length: done}, (_, i) => el("i", {class: "under", style: "transform:translate(" + (i + 1) * 3 + "px," + (i + 1) * 3 + "px)"})));
    grid.append(pile);
    pile.append(solKeycap("CARD"));
    pile.append(face);
  });
  // The deck lies on the table beside the cards, as big as they are.
  c.append(el("div", {class: "soltable"}, solDecks(pass, true), grid));
  const prevEls = SOL.els;
  // The stack the last card went onto says so.
  const landed = SOL.landed && els.get(SOL.landed);
  if (landed) landed.classList.add("sollanded");
  SOL.landed = null;
  // A new card asked what the last one was: its answers are already out.
  const keep = SOL.keepHand && !before && SOL.shown && SOL.shown.asked === (f ? f.k : null);
  if (!before) SOL.keepHand = false;
  SOL.els = els;
  // asked outlives a card answered in full, which has no question on it.
  SOL.shown = {key, r, step: hand ? hand.k : null, asked: f ? f.k : before ? before.asked : null};
  const now = SOL.shown;
  requestAnimationFrame(() => {
    solAnimate(before, now, took, prevEls, keep ? new Map() : els, cells, pile);
    solRestore();
  });
  return c;
}
