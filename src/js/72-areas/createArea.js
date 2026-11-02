function createArea(title) {
  const clean = slugify(title);
  const path = join(DIRS.areas, clean + ".md");
  if (!V.pages.has(path)) putPage(path, areaTemplate(clean));
  return path;
}
