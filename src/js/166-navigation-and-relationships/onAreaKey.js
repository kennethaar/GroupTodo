function onAreaKey(e) {
  const t = convertTarget(e);
  if (t) {
    const {r, host} = t;
    if (r.space && r.space !== V.space) { notify("Open that area first.", "warn"); return true; }
    if (r.block) {
      if (host) host.blur();
      areaFromLine(r.path, r.block);
      return true;
    }
    if (statusDirOf(r.path) && !isHorizonPage(r.path)) { projectToArea(r.path); return true; }
    return false;
  }
  if (state.view === "page" && state.pagePath && statusDirOf(state.pagePath) && !isHorizonPage(state.pagePath)) {
    projectToArea(state.pagePath); return true;
  }
  return false;
}
