/* Appends a [[link]] to a task's own line, which is where a task keeps its
   context and its project -- the same text the outliner would have typed. */
function blockLinkAdd(a, ref) {
  return inSpace(a.space, () => {
    const prev = a.block.title;
    const have = linksIn(prev).map(t => trim(String(t).split("][")[0]).toLowerCase());
    if (have.includes(ref.toLowerCase())) return null;
    a.block.title = trim(prev) + " [[" + ref + "]]";
    createLinkedPages(a.block.title);
    touch(a.path);
    noteTodoTouched();
    return () => inSpace(a.space, () => { a.block.title = prev; touch(a.path); });
  });
}
