/* The question on the table: one being changed, a list still being picked
   from, or else the first one not answered yet. */
function solStepNow(r, steps) {
  const k = SOL.hold || SOL.step;
  return (k && steps.find(f => f.k === k)) || steps.find(f => !f.filled(r)) || null;
}
