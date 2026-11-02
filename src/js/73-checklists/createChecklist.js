function createChecklist(title, kind, cadence) {
  const clean = slugify(title);
  const path = join(DIRS.lists, clean + ".md");
  if (!V.pages.has(path)) putPage(path, checklistTemplate(clean, kind, cadence));
  return path;
}
