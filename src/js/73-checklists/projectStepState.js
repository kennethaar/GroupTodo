/* What a project template's line becomes in the new project (#435): what it
   is in the template. A task keeps its state, a heading or a note stays one.
   A template written with plain lines only -- the old way -- still turns its
   lines into tasks, but never a heading. Returns the state, or null. */
function projectStepState(page) {
  let any = false;
  walkBlocks(page?.blocks || [], b => { if (b.state) any = true; });
  return b => b.state || (!any && !headLevel(b.title, false) ? "TODO" : null);
}

/* How many steps (tasks) a project template makes. */
function projectTemplateSteps(path) {
  const page = getPage(path); if (!page) return 0;
  const stateOf = projectStepState(page);
  return flattenBlocks(page.blocks).filter(stateOf).length;
}
