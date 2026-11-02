function tourProjectPath() {
  if (TOUR_PATH_CACHE !== undefined) return TOUR_PATH_CACHE;
  if (!V || !V.pages) return null;                      // called before a space is open
  let found = null;
  for (const path of V.pages.keys()) {
    if (!statusDirOf(path)) continue;
    if (trim(getPage(path)?.props?.[TOUR_PROP] || "")) { found = path; break; }
  }
  return (TOUR_PATH_CACHE = found);
}
