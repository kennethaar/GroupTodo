function renameIntoNamespace(path, root, name) {
  if (!name) return path;
  const newPath = join(root, name + ".md");
  if (newPath === path) {
    getPage(path).props.title = name;
    touch(path); render();
    return path;
  }
  if (newPath.startsWith(path.replace(/\.md$/i, "") + "/")) { notify("A page cannot go inside itself.", "warn"); render(); return path; }
  // Taken, in any case -- one file on Windows: offer to merge into it instead.
  const taken = V.pages.has(newPath) ? newPath : allPages(p => p !== path && p.toLowerCase() === newPath.toLowerCase())[0];
  if (taken && isContextPath(path)) { mergeContextInto(ctxNameOf(path), ctxNameOf(taken)); return taken; }
  if (taken) { offerMergeInto(path, taken); render(); return path; }
  const oldRef = pageRef(path);
  if (!moveFile(path, newPath)) return path;
  moveChildrenOf(path, newPath, oldRef);
  getPage(newPath).props.title = name;
  touch(newPath);
  syncCtxChildren(ctxParentPath(path)); syncCtxChildren(ctxParentPath(newPath));
  if (state.view === "page" && state.pagePath === path) state.pagePath = newPath;
  render();
  return newPath;
}
