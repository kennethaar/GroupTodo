function actOrder(pass = solPassNo()) {
  const steps = solSteps(pass);
  return actDeck().filter(r => !actAnsNow(r)["p" + pass] && steps.some(f => !f.filled(r)))
    .sort((x, y) => (y.age ?? -1) - (x.age ?? -1));
}
