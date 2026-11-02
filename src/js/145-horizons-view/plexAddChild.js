function plexAddChild(nd, after) {
  after = after || (() => render());
  if (!nd) return;
  if (nd.ghost) { notify("Make " + nd.label + " a page first, then it can have children.", "warn"); return; }
  if (nd.task) {
    const hit = inSpace(nd.space, () => findBlock(nd.blockId));
    if (!hit) { notify("That task is no longer there.", "warn"); return; }
    promptInput({
      title: "Sub-action", hint: nd.label,
      label: "What is the next step inside this one?",
      value: "", cta: "Add",
      onSave: text => {
        if (!trim(text)) return;
        const blk = inSpace(nd.space, () => addSubActionTo(hit.path, hit.block, trim(text)));
        PLEX.cursor = (nd.space || "") + "\u0000" + hit.path + "\u0000#" + blk.id;
        if (!fileInCurrentContext(nd.space, hit.path, blk, "Added under " + nd.label))
          notify("Added under " + nd.label);
        after();
      },
    });
    return;
  }
  if (inSpace(nd.space, () => statusDirOf(nd.path))) {
    promptInput({
      title: "Next action", hint: nd.label,
      label: "What is the very next physical action?",
      placeholder: "Call Anna about the quote", cta: "Add", suggest: true,
      onSave: text => {
        if (!trim(text)) return;
        const blk = inSpace(nd.space, () => addNextActionTo(nd.path, trim(text)));
        if (blk) PLEX.cursor = (nd.space || "") + "\u0000" + nd.path + "\u0000#" + blk.id;
        if (!fileInCurrentContext(nd.space, nd.path, blk, "Added to " + nd.label))
          notify("Added to " + nd.label);
        after();
      },
    });
    return;
  }
  plexNameModal(nd, () => after());
}
