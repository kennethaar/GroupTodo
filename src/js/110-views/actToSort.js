/* #450 how many of your next actions Review actions still has a question
   for: not reviewed this week, or missing a verb, context or home. Read
   straight from the passes, so it does not hang on the deck on the table. */
function actToSort() {
  return memo("actToSort", () => {
    const by = Object.fromEntries(actFields().map(f => [f.k, f]));
    return actDeck().filter(r => {
      const ans = actAnsNow(r);
      return ACT_PASSES.some((p, n) => !ans["p" + n] && p.steps.some(k => !by[k].filled(r)));
    }).length;
  });
}
