function solOrder(pass = solPassNo()) {
  const steps = solSteps(pass), holdPass = SOL_PASSES[pass].k === "hold";
  return (holdPass ? ["1", "3", "2"] : pass ? ["1"] : solAll() ? ["1", "3", "2"] : ["1"]).flatMap(code => visibleProjects(code))
    .filter(r => !inSpace(r.space, () => isTourProject(r.path)))
    .filter(r => holdPass ? solHeld(r) && !solOpenHold(r) : !solHeld(r))
    .filter(r => !pass || steps.some(f => !f.filled(r)))
    .sort((a, b) => (solIdle(b) ?? 1e6) - (solIdle(a) ?? 1e6));
}
