/* What the ladder says about one area, or null while it is not open here. */
function areaSummary(name) {
  if (!LOADED.has(name)) {
    if (!HZ_LOADING.has(name)) {
      HZ_LOADING.add(name);
      loadSpaceRecord(name).then(() => { if (state.view === "horizons") render(); }).catch(() => {});
    }
    return null;
  }
  return inSpace(name, () => ({
    resp: areaList().map(p => ({path: p, title: pageTitle(p)})),
    active: projectsIn("1").length,
    waiting: projectsIn("3").length,
    face: whoAmI() ? avatarNode(whoAmI(), 32) : null,
  }));
}
