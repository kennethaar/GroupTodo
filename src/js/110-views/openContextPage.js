function openContextPage(name) {
  const path = contextPath(name);
  for (const n of visibleSpaces()) {
    if (LOADED.has(n) && inSpace(n, () => V.pages.has(path))) { openPageIn(n, path); return; }
  }
  putPage(path, pageTemplateFor("c", name));
  openPage(path);
}
