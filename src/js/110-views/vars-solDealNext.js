/* The hand is gathered up into the card and the next one dealt. */
const solDealNext = () => (solSaveAns(), solSweep(() => { solDealt(); SOL.i++; SOL.focus = null; SOL.more = null; SOL.hold = null; SOL.step = null; render(); }));
