function parentOf(page, block) {
  let par = null;
  walkBlocks(page.blocks, (b, p) => { if (b === block) par = p; });
  return par;
}
