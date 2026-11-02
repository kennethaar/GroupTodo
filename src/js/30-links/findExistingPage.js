/* Find an existing page for a link target, searching every root like init.lua did. */
function findExistingPage(target) {
  // [[page|label]] and [[page#heading]] both name the page before the mark.
  target = trim(String(target).split("|")[0].split("#")[0]).replace(/\.md$/i, "");
  const direct = resolveWikiPath(target);
  if (V.pages.has(direct)) return direct;
  if (/^\d{4}-\d{2}-\d{2}$/.test(target) || WEEK_RE.test(target)) return null;
  const slug = slugify(target.includes("/") ? target.split("/").pop() : target);
  const roots = [PAGES, DIRS.active, DIRS.someday, DIRS.waiting, DIRS.completed,
                 DIRS.cancelled, DIRS.people, DIRS.contexts, DIRS.orgs, DIRS.zettel, DIRS.mail, DIRS.reviews];
  for (const r of roots) {
    const p = join(r, slug + ".md");
    if (V.pages.has(p)) return p;
  }
  return null;
}
