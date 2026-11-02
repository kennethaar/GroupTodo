/* ---------- one folder for the stencils ----------
   pages/templates/ and pages/8/ held the same kind of page: one you keep in
   order to pour it into another page later. The template folder's pages were
   poured when a page was created, the lists when you ran them, and that was
   the whole difference -- a difference in when, dressed up as a difference in
   kind. So the templates move in with the lists, keeping their names, because
   the names are what the date cascade looks them up by: "journals", "1",
   "2026-W38". A name already taken in pages/8/ keeps its "-template" suffix
   rather than overwriting somebody's list. */
function migrateTemplates() {
  let moved = 0;
  const old = DIRS.templates;
  for (const path of Array.from(V.pages.keys())) {
    if (!path.startsWith(old + "/")) continue;
    const rest = path.slice(old.length + 1);
    let target = join(DIRS.lists, rest);
    if (V.pages.has(target)) target = join(DIRS.lists, rest.replace(/\.md$/i, "") + "-template.md");
    if (V.pages.has(target)) { removePage(path); continue; }
    putPage(target, getPage(path));
    removePage(path);
    moved++;
  }
  if (moved) notify("Moved " + moved + " template(s) into pages/8/, with the lists.");
  return moved;
}
