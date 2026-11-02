/* A cut pasted in the area it came from is an ordinary cut and paste: no
   question about areas, the branch just goes to where it was pasted -- after
   the line pasted on, or in its place when that line is an empty one. */
function moveBranchHere(src, dest) {
  inSpace(src.space, () => {
    const hit = findBlock(src.id);
    if (!hit) { notify("That line no longer exists.", "warn"); return; }
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    const destPage = getPage(dest.path);
    if (!destPage) return;
    const anchor = dest.id ? findBlock(dest.id) : null;
    let inside = false;
    if (anchor) walkBlocks([hit.block], b => { if (b === anchor.block) inside = true; });
    if (inside) { notify("A line cannot go inside itself."); return; }
    const before = new Map([[hit.path, serializePage(hit.page)], [dest.path, serializePage(destPage)]]);
    removeBlockFrom(hit.page, hit.block);
    if (anchor && anchor.path === dest.path) {
      const sibs = siblingsOf(destPage, anchor.block), at = sibs.indexOf(anchor.block);
      const spare = trim(anchor.block.title || "") === "" && !anchor.block.state &&
        !(anchor.block.children || []).length && !(anchor.block.body || []).length;
      sibs.splice(at + 1, 0, hit.block);
      if (spare) sibs.splice(at, 1);
    } else destPage.blocks.push(hit.block);
    if (!hit.page.blocks.length) hit.page.blocks.push(newBlock({title: ""}));
    for (const p of before.keys()) touch(p);
    noteTodoTouched();
    render();
    focusBlock(hit.block.id);
    notify("Line moved.");
    pushUndo({run: () => {
      inSpace(src.space, () => { for (const [p, text] of before) { putPage(p, parsePage(text)); touch(p); } });
      render();
      notify("Put back.");
      return true;
    }});
  });
}
