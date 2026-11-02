function makeContext(name) {
  const clean = ctxSlug(name) || slugify(name);
  const path = join(DIRS.contexts, clean + ".md");
  if (!V.pages.has(path)) {
    const fresh = !contextList().includes(clean);
    putPage(path, pageTemplateFor("c", clean)); syncCtxChildren(ctxParentPath(path));
    if (fresh) mergeLookalikeContext(clean);
  }
  return clean;
}
