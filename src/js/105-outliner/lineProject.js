function lineProject(path, block) {
  if (!isJournalPath(path)) return statusDirOf(path) ? {path, title: pageTitle(path)} : null;
  const link = nearestProjectAncestor(block);
  return link ? {path: findExistingPage(link.ref), title: link.title, ref: link.ref} : null;
}
