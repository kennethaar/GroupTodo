function timeLogProjectPath(name) {
  const low = name.toLowerCase();
  return allPages(q => statusDirOf(q) && !isHorizonPage(q))
    .find(q => pageTitle(q).toLowerCase() === low || baseName(q).toLowerCase() === low) || null;
}
