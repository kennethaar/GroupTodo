function removeDuplicateLines(paths, {quiet = false} = {}) {
  const space = V.space;
  const snaps = [];
  let total = 0;
  for (const path of paths) {
    const page = getPage(path);
    if (!page || !dedupWritable(path) || !countDuplicateLines(path)) continue;
    snaps.push([path, clonePage(page)]);
    total += dedupSiblings(page.blocks, true);
    touch(path);
  }
  if (!total) { if (!quiet) notify(paths.length === 1 ? "No duplicate lines on this page." : "No duplicate lines found."); return 0; }
  const undo = () => inSpace(space, () => {
    for (const [path, snap] of snaps) {
      const page = getPage(path);
      if (!page) continue;
      page.props = snap.props; page.blocks = snap.blocks;
      touch(path);
    }
    render();
    return true;
  });
  pushUndo({run: undo});
  render();
  notify("Took out " + total + " duplicate line" + (total === 1 ? "" : "s") +
    (snaps.length > 1 ? " on " + snaps.length + " pages" : "") + ". What was under them is kept.", "info",
    {label: "Undo", run: undo});
  return total;
}
