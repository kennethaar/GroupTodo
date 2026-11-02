/* The blocks themselves, in the order they are on screen. A redraw can have
   happened since the pick, so they are looked up by id every time. */
function lineSelBlocks() {
  const page = LINE_SEL.path ? getPage(LINE_SEL.path) : null;
  if (!page) return null;
  const blocks = [];
  for (const id of LINE_SEL.ids) {
    let hit = null;
    walkBlocks(page.blocks, b => { if (b.id === id) hit = b; });
    if (hit) blocks.push(hit);
  }
  return blocks.length ? {page, blocks} : null;
}
