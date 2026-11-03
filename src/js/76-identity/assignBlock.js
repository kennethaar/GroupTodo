function assignBlock(path, block, name, quiet) {
  const kind = assignKind(name);
  if (kind === "mine") {
    delete block.props[ASSIGN_PROP];
    for (const k of Object.keys(block.props)) if (/^assigned_at$/i.test(k)) delete block.props[k];
    if (block.state === "WAIT") block.state = "TODO";
  } else {
    setBlockProp(block, ASSIGN_PROP, trim(name));
    setBlockProp(block, "assigned_at", nowStamp());
    if (kind === "outside") {
      // Nobody here can act on it, so for this vault it is a waiting-for.
      if (OPEN_STATES[block.state]) block.state = "WAIT";
    } else if (block.state === "WAIT") {
      block.state = "TODO";                 // a member, or the household, can actually do it
    }
  }
  if (!blockProp(block, "by")) stampAuthor(block);
  touch(path);
  if (quiet) return;
  render();
  notify(kind === "mine" ? "Back to you."
       : kind === "member" ? trim(name) + " has it. It is in your Waiting for."
       : kind === "household" ? trim(name) + " has it. Tick it off for them when it is done."
       : "Waiting on " + trim(name) + ".");
}
