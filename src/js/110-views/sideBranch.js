/* A line on the page, by the id it has now or the id:: written on it. */
function sideBranch(page, branch) {
  let hit = null;
  if (branch) walkBlocks(page.blocks, b => { if (!hit && (b.id === branch || trim(blockProp(b, "id") || "") === branch)) hit = b; });
  return hit;
}
