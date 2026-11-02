function pageTemplateFor(kind, title) {
  if (STATUS_DIRS[kind]) return projectTemplateLines(title,kind);
  return pageFromTemplate(kind,title,{kind});
}
