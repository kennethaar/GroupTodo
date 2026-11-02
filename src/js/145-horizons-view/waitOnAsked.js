/* A to-do of your own that names them, once asked about, is theirs to answer:
   it waits on them, and next time it is under Waiting for. Taken after the
   asking has stamped the lines, so Undo keeps the id their reply comes home
   by and only the waiting goes. */
function waitOnAsked(chosen, name) {
  const toWait = chosen.filter(a => a.mention && a.block.state !== "WAIT");
  if (!toWait.length) return;
  const snaps = [];
  for (const a of toWait)
    if (!snaps.some(s => s.space === a.space && s.path === a.path))
      snaps.push({space: a.space, path: a.path, page: inSpace(a.space, () => structuredClone(getPage(a.path)))});
  for (const a of toWait) inSpace(a.space, () => {
    a.block.state = "WAIT";
    setBlockProp(a.block, ASSIGN_PROP, trim(name));
    setBlockProp(a.block, "assigned_at", nowStamp());
    touch(a.path);
  });
  const back = () => {
    for (const s of snaps) inSpace(s.space, () => {
      const p = getPage(s.path);
      if (p) { Object.assign(p, structuredClone(s.page)); touch(s.path); }
    });
    noteTodoTouched();
    render();
    return true;
  };
  pushUndo({run: back});
  noteTodoTouched();
  notify(toWait.length === 1 ? "Waiting on " + trim(name) + "."
                             : toWait.length + " lines now wait on " + trim(name) + ".",
    "info", {label: "Undo", run: back});
}
