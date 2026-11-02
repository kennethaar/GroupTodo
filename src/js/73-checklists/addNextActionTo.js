function addNextActionTo(path, text) {
  const page = getPage(path); if (!page) return null;
  const blk = stampAuthor(newBlock({state: "TODO", title: text, props: {}}));
  createLinkedPages(blk.title);
  page.blocks.push(blk);
  touch(path);
  return blk;
}
