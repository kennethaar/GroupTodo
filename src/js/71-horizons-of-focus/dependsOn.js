/* The prerequisites of one project, as paths. Links that no longer resolve are
   dropped rather than reported: a page somebody deleted is not a blocker. */
function dependsOn(path) {
  const page = getPage(path); if (!page) return [];
  const raw = trim(page.props?.[DEPENDS_PROP] || "");
  if (!raw) return [];
  const out = [];
  for (const target of linksIn(raw)) {
    const p = findExistingPage(trim(target.split("][")[0]));
    if (p && p !== path && !out.includes(p)) out.push(p);
  }
  return out;
}
