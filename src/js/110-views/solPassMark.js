/* The card is done with in this pass, and the project reviewed when nothing
   is left to ask of it. quiet: said by the table, not by a message. */
function solPassMark(r, quiet = false) {
  solPassed(r);
  if (r.block) return;
  /* Its status settled is the project reviewed, and that is written on the
     page at once -- kept only in memory, a reload dealt the whole status pass
     again and a project kept as active looked as if it had never been seen.
     Quietly: the stacks on the table already say where it went. */
  if (!solPassNo() || SOL_PASSES[solPassNo()].k === "hold") solMarkReviewed(r, true);
  else if (solFields().every(f => f.filled(r))) solMarkReviewed(r, quiet);
}
