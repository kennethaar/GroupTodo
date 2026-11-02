/* What is in a context's folder, written on its own page as well --
   children:: [[c/home/kitchen]], [[c/home/bathroom]] -- so the file says what
   the app shows. The page is made if the folder has none yet, the way Logseq
   makes home when you write home/kitchen. Touched only when it changes. */
function syncCtxChildren(parentPath) {
  if (!parentPath) return;
  const dir = parentPath.replace(/\.md$/i, "") + "/";
  const kids = allPages(p => p.startsWith(dir) && !p.slice(dir.length).includes("/"));
  let page = getPage(parentPath);
  if (!page && !kids.length) return;
  if (!page) page = putPage(parentPath, pageTemplateFor("c", dir.slice(DIRS.contexts.length + 1, -1)));
  const value = kids.map(p => "[[" + pageRef(p) + "]]").join(", ");
  const key = Object.keys(page.props).find(k => /^(children|parent_of)$/i.test(k));
  if ((key ? page.props[key] : "") === value && (!key || key === "children")) return;
  if (key) delete page.props[key];
  if (value) page.props.children = value;
  touch(parentPath);
}
