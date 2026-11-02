function createGoal(title, area) {
  const clean = slugify(title);
  const path = join(DIRS.goals, clean + ".md");
  if (!V.pages.has(path)) putPage(path, goalTemplate(clean));
  if (area) { getPage(path).props.area = "[[a/" + area + "]]"; touch(path); }
  return path;
}
