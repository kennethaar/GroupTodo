/* Remove a block, remembering enough to put it back. */
function deleteBlockWithUndo(path, block, label) {
  const page = getPage(path);
  if (!page) return;
  const parent = parentOf(page, block);
  const sibs = parent ? (parent.children || []) : page.blocks;
  const index = sibs.indexOf(block);
  const copy = cloneBlock(block);
  const parentTitle = parent ? parent.title : null;
  const space = Spaces.active;

  removeBlockFrom(page, block);
  touch(path);
  render();

  const restore = () => {
    let ok = false;
    inSpace(space, () => {
      const pg = getPage(path);
      if (!pg) return;
      let list = pg.blocks;
      if (parentTitle != null) {
        let found = null;
        walkBlocks(pg.blocks, b => { if (!found && b.title === parentTitle) found = b; });
        if (found) list = found.children || (found.children = []);
      }
      const at = index >= 0 && index <= list.length ? index : list.length;
      list.splice(at, 0, cloneBlock(copy));
      touch(path);
      ok = true;
    });
    if (ok) { render(); notify("Put back."); }
    return ok;
  };
  pushUndo({run: restore, label});
  notify((label || "Deleted") + ".", "info", {label: "Undo", run: restore});
}
