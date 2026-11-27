/* Every line the AI wrote has its answer: on to sorting the to-dos (#516
   follow-up). They were looked at just now, so Still to do is answered for
   them, here and in the weekly review; the first pass they still need is
   dealt, and with none, the run is done. */
function cuToSort() {
  const mine = actDeck().filter(a => CU_RUN.ids.has(a.block.id));
  for (const a of mine) if (!actReviewedThisWeek(a)) actStampReviewed(a);
  clearMemo();
  CU_RUN.phase = "sort";
  state.sub = "actions";
  const pass = ACT_PASSES.findIndex((p, n) => actOrder(n).length);
  if (pass < 0) CU_RUN.phase = "done";
  SOL = {order: null, i: 0, focus: null, more: null, pass: Math.max(0, pass), deck: "a", day: todayISO()};
  SOL_KB = null;
}
