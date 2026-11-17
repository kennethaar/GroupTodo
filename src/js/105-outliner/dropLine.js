/* #423 A line dragged by its bullet lands before or after another line, or
   "into" it as its last line. "After" a line whose own lines show puts it
   first among them, where the bar was drawn. Ctrl+Z puts it back. */
function dropLine(space, id, toId, where) {
  inSpace(space, () => {
    const src = findBlock(id), dst = findBlock(toId);
    if (!src || !dst || src.block === dst.block) return;
    let inside = false;
    walkBlocks([src.block], x => { if (x === dst.block) inside = true; });
    if (inside) return;
    const before = new Map([[src.path, serializePage(src.page)], [dst.path, serializePage(dst.page)]]);
    removeBlockFrom(src.page, src.block);
    const kids = dst.block.children || (dst.block.children = []);
    if (where === "into") { kids.push(src.block); dst.block.collapsed = false; }
    else if (where === "after" && kids.length && !dst.block.collapsed) kids.unshift(src.block);
    else {
      const sibs = siblingsOf(dst.page, dst.block);
      sibs.splice(sibs.indexOf(dst.block) + (where === "after" ? 1 : 0), 0, src.block);
    }
    if (!src.page.blocks.length) src.page.blocks.push(newBlock({title: ""}));
    for (const p of before.keys()) touch(p);
    noteTodoTouched();
    render();
    pushUndo({run: () => {
      inSpace(space, () => { for (const [p, text] of before) { putPage(p, parsePage(text)); touch(p); } });
      render();
      notify("Put back.");
      return true;
    }});
  });
}
