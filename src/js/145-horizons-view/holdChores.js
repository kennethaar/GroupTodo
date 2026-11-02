/* Away: every chore on hold until the day you are back. A hold that ends
   counts as done that day, so you come back to a clean slate, not a red wall. */
function holdChores(until) {
  const snaps = new Map();
  for (const a of choreRows()) inSpace(a.space, () => {
    const key = (a.space || V.space) + "\n" + a.path;
    if (!snaps.has(key)) snaps.set(key, {space: a.space || V.space, path: a.path, page: structuredClone(getPage(a.path))});
    setBlockProp(a.block, "hold", "[[" + until + "]]");
    touch(a.path);
  });
  const undo = () => {
    for (const s of snaps.values()) inSpace(s.space, () => {
      if (!getPage(s.path)) return;
      Object.assign(getPage(s.path), structuredClone(s.page));
      touch(s.path);
    });
    render();
    return true;
  };
  pushUndo({run: undo});
  render();
  notify("Every chore waits until " + humanDate(until) + ".", "info", {label: "Undo", run: undo});
}
