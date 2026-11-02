function solUse(deck) {
  if ((SOL.deck || "p") === deck) return;
  const was = SOL;
  SOL = SOL_PARKED && (SOL_PARKED.deck || "p") === deck ? SOL_PARKED : {order: null, i: 0, focus: null, more: null, pass: 0, deck};
  SOL_PARKED = was;
  SOL.shown = null; SOL_KB = null;
}
