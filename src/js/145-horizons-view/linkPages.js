/* True when the link was added; false when it was already there. */
function linkPages(fromNode, toRef) {
  if (!fromNode || fromNode.ghost || !toRef) return false;
  return inSpace(fromNode.space, () => {
    const page = getPage(fromNode.path);
    if (!page) return false;
    const want = "[[" + toRef + "]]";
    let found = false;
    walkBlocks(page.blocks, x => {
      if (linksIn([x.title, ...(x.body || [])].join("\n"))
          .some(t => trim(t.split("][")[0]).toLowerCase() === toRef.toLowerCase())) found = true;
    });
    if (found) return false;
    relatedBlockOf(page).children.push(newBlock({title: want}));
    createLinkedPages(want);
    touch(fromNode.path);
    return true;
  });
}
