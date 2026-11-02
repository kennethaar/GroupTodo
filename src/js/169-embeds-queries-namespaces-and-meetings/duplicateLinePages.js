/* Every page in the areas on screen with a line written twice, most first. */
function duplicateLinePages() {
  return acrossSpaces(() => allPages(p => dedupWritable(p) && pageKind(p) !== "verb")
    .map(path => ({path, n: countDuplicateLines(path)})).filter(x => x.n > 0))
    .sort((a, b) => b.n - a.n || a.path.localeCompare(b.path));
}
