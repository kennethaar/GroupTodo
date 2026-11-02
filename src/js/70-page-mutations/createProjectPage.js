function createProjectPage(title, blocks) {
  const clean = slugify(title);
  const path = join(DIRS.active, clean + ".md");
  if (V.pages.has(path)) return path;
  const page = projectTemplateLines(clean, "1");
  if (blocks && blocks.length) page.blocks = blocks;
  // The standard clients (share:: on their page) come with every new project.
  const clients = defaultClients();
  if (clients.length && !trim(page.props.org || "")) page.props.org = clients.map(o => "[[o/" + o + "]]").join(", ");
  putPage(path, page);
  return path;
}
