/* Where a page's namespace starts: contexts under c/, plain pages under
   pages/. People, organisations, projects and the rest have no namespaces. */
function namespaceRoot(path) {
  if (path.startsWith(DIRS.contexts + "/")) return DIRS.contexts;
  if (!isPagePath(path) || Object.values(DIRS).some(d => d !== PAGES && path.startsWith(d + "/"))) return null;
  return PAGES;
}
