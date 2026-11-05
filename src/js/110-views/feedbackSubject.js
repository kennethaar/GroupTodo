/* What the feedback asks you to decide on. A word on an open to-do is about
   that to-do. A word on something you wait for, or something already
   finished, inside a project is about the project: what does it do next?
   The path is looked up again, since an outcome may have moved the page. */
function feedbackSubject(f) {
  return inSpace(f.space, () => {
    const holds = p => { let hit = false; walkBlocks((V.pages.get(p) || {}).blocks || [], b => { if (b === f.block) hit = true; }); return hit; };
    if (!holds(f.path)) for (const p of V.pages.keys()) if (holds(p)) { f.path = p; break; }
    const open = f.block.state === "TODO" || f.block.state === "DOING";
    const project = open ? null : projectOfBlock(f.path, f.block);
    return project ? {kind: "project", project} : {kind: "todo"};
  });
}
