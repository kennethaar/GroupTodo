/* A page made from the graph is a page like any other: a file with a title.
   It is linked to whatever you dragged it out of, so it is never born an
   orphan nobody can find again. */
function createNodeFrom(fromNode, name) {
  const title = trim(name);
  if (!title) return null;
  return inSpace(fromNode ? fromNode.space : null, () => {
    const path = findExistingPage(title) || (() => {
      const p = resolveWikiPath(title);
      putPage(p, pageTemplateFor(/^([^/]+)\//.test(title) ? title.split("/")[0] : "page",
                                 title.includes("/") ? title.split("/").slice(1).join("/") : title));
      return p;
    })();
    if (fromNode) linkPages(fromNode, pageRef(path));
    scanVerbs();
    return path;
  });
}
