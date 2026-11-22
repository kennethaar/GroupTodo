/* The line a link points at, by its id::, on the page it names. */
function linkedBlock(link) {
  const page = V.pages.get(link.path);
  let found = null;
  if (page && link.block) walkBlocks(page.blocks, b => {
    if (!found && trim(blockProp(b, "id") || "") === link.block) found = b;
  });
  return found;
}
