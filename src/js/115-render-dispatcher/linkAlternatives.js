/* Every alternative of the same kind, so the swap list is the list you would
   have been shown anyway, one click earlier. */
function linkAlternatives(kind) {
  if (kind === "context") return contextList().map(c => ["c/" + c, "@" + c]);
  if (kind === "project")
    return [...projectsIn("1"), ...projectsIn("3"), ...projectsIn("2")]
      .map(p => [pageRef(p), pageTitle(p)]);
  const dir = kind === "person" ? DIRS.people : kind === "org" ? DIRS.orgs : DIRS.zettel;
  const pfx = kind === "person" ? "p/" : kind === "org" ? "o/" : "z/";
  const names = allPages(p => p.startsWith(dir + "/")).map(baseName);
  if (kind === "person") for (const m of members()) if (!names.includes(m.name)) names.push(m.name);
  return names.sort((a, b) => a.localeCompare(b)).map(n => [pfx + n, n]);
}
