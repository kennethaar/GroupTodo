/* This card has had its turn in this pass: gather the hand up and deal the
   next. A project that stays waiting or someday is not dealt again, so the
   first pass is its review. */
function solPassDone(r) {
  solPassMark(r);
  solDealNext();
}
