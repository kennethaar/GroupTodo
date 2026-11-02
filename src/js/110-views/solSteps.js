function solSteps(pass = solPassNo()) {
  if (actDeckOn()) { const by = Object.fromEntries(actFields().map(f => [f.k, f])); return ACT_PASSES[pass].steps.map(k => by[k]); }
  const by = Object.fromEntries([...solFields(), solHoldField()].map(f => [f.k, f]));
  return SOL_PASSES[pass].steps.map(k => by[k]);
}
