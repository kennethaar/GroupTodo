/* The line is still where the card says. A page read again from disk is new
   objects, so the line is looked for again there by its words. */
function actHere(r) {
  return inS(r, () => {
    const page = getPage(r.path);
    if (!page) return false;
    let hit = null, same = null;
    walkBlocks(page.blocks, b => { if (b === r.block) hit = b; else if (!same && b.title === r.block.title) same = b; });
    if (!hit && same) r.block = same;
    return !!(hit || same);
  });
}
