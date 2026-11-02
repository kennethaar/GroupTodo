/* The cards this pass has dealt past, last on top, so Back can deal one again. */
function solDealt() {
  const r = SOL.order && SOL.order[SOL.i];
  if (r) (SOL.past || (SOL.past = [])).push(solKey(r));
}
