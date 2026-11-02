function applyWizard() {
  const lines = v => v.split("\n").map(trim).filter(Boolean);
  const areas = lines(WIZ.areas);
  const goals = lines(WIZ.goals);
  /* A step the profile left out was never shown, so whatever an earlier run of
     the wizard left in WIZ for it is not an answer about this space. */
  for (const a of areas) createArea(a);
  for (const g of goals) createGoal(g);
  const wrote = {};
  for (const key of ["vision", "purpose"]) {
    if (!horizonActive(key) || !trim(WIZ[key])) continue;
    setHorizon(key, lines(WIZ[key]));
    wrote[key] = true;
  }
  setSetting("horizons_done", todayISO());
  const made = [];
  if (areas.length) made.push(areas.length + " responsibilities");
  if (goals.length) made.push(goals.length + " goals");
  for (const key of ["vision", "purpose"]) {
    if (wrote[key]) made.push("a " + horizonMeta(key).name.toLowerCase());
  }
  notify(made.length ? "Created " + made.join(", ") + "." : "Nothing created - run it again any time.");
  render();
}
