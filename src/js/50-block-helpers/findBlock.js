/* Locate a block anywhere in the vault by id. */
function findBlock(id) {
  for (const [path, page] of V.pages) {
    let found = null;
    walkBlocks(page.blocks, b => { if (b.id === id) found = b; });
    if (found) return {path, page, block: found};
  }
  return null;
}
