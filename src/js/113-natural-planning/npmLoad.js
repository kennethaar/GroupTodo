/* The draft for a project, or the plan read back off its page. */
function npmLoad(space, path) {
  const d = npmDraft(space, path);
  // A draft from before What comes first (#275) counted Off your mind? as the step it now has.
  if (d && !d.before) { d.before = {}; d.firstLast = []; if (d.step >= NPM_STEPS.findIndex(s => s.k === "first")) d.step++; }
  return d || inSpace(space, () => npmFromPage(space, path));
}
