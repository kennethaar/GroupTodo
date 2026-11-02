/* status: the shelf a caller (the rename dialog's folder) wants the project on,
   for when the name is taken and the two have to become one. Returns null when
   that question is open: nothing has moved yet. */
function renamePage(path, newTitle, {status = null} = {}) {
  const page = getPage(path);
  if (!page) return path;
  const clean = trim(
    String(newTitle || "")
      .split("/")
      .pop(),
  );
  if (!clean) return path;
  if (isJournalPath(path)) {
    page.props.title = clean;
    touch(path);
    render();
    return path;
  }
  /* Logseq's way with a namespace: renamed home/kitchen, the kitchen goes
     into home's folder, and renamed kitchen again it comes back out. Only a
     context or a plain page; a name with no / on a page whose title had none
     stays in the folder it is in, as before. */
  const full = String(newTitle || "").split("/").map(trim).filter(Boolean).map(slugify).join("/");
  const nsRoot = namespaceRoot(path);
  if (nsRoot && (full.includes("/") || pageTitle(path).includes("/"))) return renameIntoNamespace(path, nsRoot, full);
  const dir = path.split("/").slice(0, -1).join("/"),
    newPath = join(dir, slugify(clean) + ".md");
  if (newPath === path) {
    page.props.title = clean;
    touch(path);
    render();
    return path;
  }
  const twin = projectTwin(path, newPath);
  if (twin) { askRenameOntoTwin(path, twin, status); return null; }
  const oldRef = pageRef(path);
  const moved = moveFile(path, newPath);
  if (!moved) return path;
  moveChildrenOf(path, newPath, oldRef);
  const renamed = getPage(newPath);
  if (renamed) {
    renamed.props.title = clean;
    touch(newPath);
  }
  if (state.view === "page" && state.pagePath === path) state.pagePath = newPath;
  render();
  return newPath;
}
