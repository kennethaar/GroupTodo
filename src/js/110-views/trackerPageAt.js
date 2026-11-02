function trackerPageAt(name) {
  const path = trackerPagePath(name);
  for (const sp of new Set([V.space, ...LOADED.keys()])) {
    const page = inSpace(sp, () => getPage(path));
    if (page) return {space: sp, path, page};
  }
  return null;
}
