function shelveAsWaiting(path) {
  const code = statusDirOf(path);
  if (!code || code === "3" || isHorizonPage(path)) return path;
  setProjectStatus(path, "3");
  const moved = join(STATUS_DIRS["3"], baseName(path) + ".md");
  if (V.pages.has(moved)) { notify(pageTitle(moved) + " moved to Waiting for."); return moved; }
  return path;
}
