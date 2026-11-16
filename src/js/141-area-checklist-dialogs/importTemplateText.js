/* A template or checklist from a Markdown file (#420): its lines are the
   steps, its title:: or file name the name. kind:: project keeps it a project
   template; without it, it is a checklist. A name already taken gets a number,
   so nothing here is replaced. A file with no lines is not one: null. */
function importTemplateText(fileName, text) {
  const page = parsePage(text);
  if (!page.blocks.length) return null;
  const name = oneLine(page.props.title || "") || oneLine(String(fileName || "").replace(/\.(md|markdown|txt)$/i, "")) || "Template";
  delete page.props.title;
  const stem = join(DIRS.lists, slugify(name));
  let path = stem + ".md";
  for (let n = 2; V.pages.has(path); n++) path = stem + " " + n + ".md";
  putPage(path, page);
  clearMemo();
  return path;
}
