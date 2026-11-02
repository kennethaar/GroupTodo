/* Port of: init.lua find_duplicate_projects */
function duplicateProjects() {
  const bySlug = new Map();
  for (const path of allPages(p => statusDirOf(p) && !isHorizonPage(p))) {
    const slug = baseName(path).toLowerCase();
    if (!bySlug.has(slug)) bySlug.set(slug, []);
    bySlug.get(slug).push(path);
  }
  return Array.from(bySlug.entries())
    .filter(([, l]) => l.length > 1)
    .map(([slug, paths]) => ({slug, paths: paths.sort()}))
    .sort((a, b) => b.paths.length - a.paths.length || a.slug.localeCompare(b.slug));
}
