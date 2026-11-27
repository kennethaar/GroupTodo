function actOrder(pass = solPassNo()) {
  const steps = solSteps(pass);
  // In the catch-up's mini review, only the AI's to-dos (#516 follow-up).
  const run = CU_RUN && CU_RUN.phase !== "clarify" ? CU_RUN.ids : null;
  return actDeck().filter(r => (!run || run.has(r.block.id)) && !actAnsNow(r)["p" + pass] && steps.some(f => !f.filled(r)))
    .sort((x, y) => (y.age ?? -1) - (x.age ?? -1));
}
