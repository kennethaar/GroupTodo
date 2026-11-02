/* This card has had its turn in this pass: gather the hand up and deal the
   next. A project that stays waiting or someday is not dealt again, so the
   first pass is its review. */
function solPassDone(r) {
  solPassed(r);
  if (r.block) { solDealNext(); return; }
  /* Its status settled is the project reviewed, and that is written on the
     page at once -- kept only in memory, a reload dealt the whole status pass
     again and a project kept as active looked as if it had never been seen.
     Quietly: the stacks on the table already say where it went. */
  if (!solPassNo() || SOL_PASSES[solPassNo()].k === "hold") solMarkReviewed(r, true);
  else if (solFields().every(f => f.filled(r))) solMarkReviewed(r);
  solDealNext();
}
