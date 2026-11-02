/* Fling the card on as reviewed (Shift+Right), or skip it to come round again
   at the end of this pass. Either way the hand is gathered up and a new card
   dealt, so it is plain that the next project is a different one. */
function solOp(r, v) {
  if (SOL.moving) return;
  if (v === "skip") {
    solSweep(() => {
      solDealt();
      SOL.order.push(SOL.order.splice(SOL.i, 1)[0]); SOL.focus = null; SOL.more = null; SOL.hold = null; SOL.step = null; render();
      notify("Skipped. It comes round again at the end of this pass.");
    }, {skip: true});
    return;
  }
  solPassed(r);
  solMarkReviewed(r, !solPassNo());
  solDealNext();
}
