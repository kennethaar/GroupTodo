function createZettel(title) {
  const clean = slugify(title);
  const path = join(DIRS.zettel, clean + ".md");
  if (!V.pages.has(path)) putPage(path, zettelTemplate(clean));
  return path;
}
