function saveNotePage(raw) {
  const {name, path} = freePageName(DIRS.zettel, pastedTitle(raw), "Note");
  const page = zettelTemplate(name);
  page.blocks = pastedBody(raw);
  putPage(path, page); touch(path);
  return {path, name, made: [path]};
}
