/* Port of: init.lua 70_HEALTH_CHECKS */
function healthScan() {
  const issues = [];
  for (const path of [...projectsIn("1"), ...projectsIn("2"), ...projectsIn("3")]) {
    const page = getPage(path);
    if (!page.props?.title) issues.push({path, type: "missing-title", text: "No title:: property"});
    if (statusDirOf(path) === "3" && !(page.props?.waiting_since || page.props?.["waiting-since"]))
      issues.push({path, type: "missing-waiting_since", text: "Waiting project without waiting_since"});
  }
  for (const [path, page] of V.pages) {
    if (isStencilPath(path)) continue;
    const check = (text, blk) => {
      for (const target of linksIn(text)) {
        const t = target.split("][")[0];
        if (/^\d{4}-\d{2}-\d{2}$/.test(t)) continue;
        if (!LINK_PREFIXES.has((/^([^/]+)\//.exec(t) || [])[1])) continue;
        if (!findExistingPage(t)) issues.push({path, block: blk, type: "broken-link", text: "Broken link: [[" + t + "]]"});
      }
    };
    walkBlocks(page.blocks, b => { check(b.title, b); (b.body || []).forEach(l => check(l, b)); });
  }
  return issues;
}
