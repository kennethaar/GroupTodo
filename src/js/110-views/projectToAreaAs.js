/* Into a new one the page itself moves; into one already there its lines go
   under a line with the project's name, links to it point at the
   responsibility, and the project is deleted -- Ctrl-Z brings it back. */
function projectToAreaAs(path, into) {
  if (into) return mergeProjectIntoArea(path, into);
  const dest = join(DIRS.areas, baseName(path) + ".md");
  if (V.pages.has(dest)) return mergeProjectIntoArea(path, dest);
  moveFile(path, dest);
  const page = getPage(dest);
  if (!page) return;
  delete page.props.status; delete page.props.area;
  touch(dest);
  openPage(dest);
  notify(pageTitle(dest) + " is a responsibility now.");
}
