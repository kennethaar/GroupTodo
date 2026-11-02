/* How many lines would go, without changing anything. */
function countDuplicateLines(path) {
  const page = getPage(path);
  return page ? dedupSiblings(page.blocks || [], false) : 0;
}
