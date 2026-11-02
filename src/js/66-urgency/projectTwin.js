/* The project of that name on another status shelf, if there is one. */
function projectTwin(path, newPath) {
  const mine = statusDirOf(path);
  if (!mine) return null;
  const slug = baseName(newPath).toLowerCase();
  return allPages(p => statusDirOf(p) && statusDirOf(p) !== mine && !isHorizonPage(p))
    .find(p => baseName(p).toLowerCase() === slug) || null;
}
