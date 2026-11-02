// Once per vault, so one deleted stays deleted.
function ensureCircleOrgs() {
  if (getSetting("circle_orgs")) return;
  for (const name of CIRCLE_ORGS) {
    if (findExistingPage("o/" + name)) continue;
    const page = pageTemplateFor("o", name);
    page.props = Object.assign({}, page.props, {circle: "true"});
    putPage(resolveWikiPath("o/" + name), page);
  }
  setSetting("circle_orgs", "true");
}
