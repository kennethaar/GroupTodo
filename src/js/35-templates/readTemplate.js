function readTemplate(name) {
  const path = join(DIRS.lists, name + ".md");
  return V.pages.has(path) ? path : null;
}
