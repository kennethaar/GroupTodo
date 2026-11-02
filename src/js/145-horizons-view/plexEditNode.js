/* ---------- editing a node where it sits ----------
   Space on a dot edits the thing the dot is: a task's line, a page's name.
   The mindmap is where you think, and a thought you cannot correct without
   leaving the picture is a thought you leave wrong. */
function plexEditNode(nd, after) {
  after = after || (() => render());
  if (!nd) return;
  if (nd.ghost) { notify("Make " + nd.label + " a page first, then there is something to edit.", "warn"); return; }
  if (nd.task) {
    const hit = inSpace(nd.space, () => findBlock(nd.blockId));
    if (!hit) { notify("That task is no longer there.", "warn"); return; }
    promptInput({
      title: "Edit this step", hint: inSpace(nd.space, () => pageTitle(hit.path)),
      label: "The line itself, links and all",
      value: hit.block.title, cta: "Save",
      onSave: text => {
        if (!trim(text)) { notify("A task with no words is not a task.", "warn"); return; }
        inSpace(nd.space, () => {
          const [st, rest] = splitState(trim(text));
          hit.block.title = st ? trim(rest) : trim(text);
          if (st && st !== hit.block.state) setBlockState(hit.path, hit.block, st);
          createLinkedPages(hit.block.title);
          touch(hit.path);
        });
        after();
      },
    });
    return;
  }
  inSpace(nd.space, () => renamePrompt(nd.path));
}
