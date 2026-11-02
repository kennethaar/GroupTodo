// What the way in is called: a draft carries on, a planned page is planned again.
function npmLabel(space, path) {
  const d = npmDraft(space, path);
  if (d) return ["Continue planning", "step " + (d.step + 1) + " of " + NPM_STEPS.length +
    (d.by && whoAmI() && !samePerson(d.by, whoAmI()) ? " · " + d.by + " is on it" : "")];
  if (inSpace(space, () => getPage(path)?.props?.planned)) return ["Re-plan", "w n · read back in from the page"];
  return ["Plan it", "w n · why, outcome, ideas, next actions, step by step"];
}
