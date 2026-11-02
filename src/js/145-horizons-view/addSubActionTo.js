/* ---------- growing the mindmap downward ----------
   Enter on the middle makes a child, which on a mindmap means one of two
   things depending on what the middle is. Under a task, or under a project,
   the child is the next action -- the thing a mindmap of a project is for.
   Under any other page it is another page, linked, which is what dragging a
   dot out into space already does. */
function addSubActionTo(path, block, text) {
  const blk = stampAuthor(newBlock({state: "TODO", title: text, props: {}}));
  createLinkedPages(blk.title);
  (block.children || (block.children = [])).push(blk);
  touch(path);
  return blk;
}
