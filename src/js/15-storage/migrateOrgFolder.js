/* Organisations in O/, with a capital letter, were never seen as
   organisations: the app looks in o/, so their names were not offered while
   typing. They move to o/ first, then the links to them follow (#434). A page
   already in o/ by the same name takes the other's lines, so nothing is lost. */
function migrateOrgFolder() {
  const old = join(PAGES, "O");
  let moved = 0;
  for (const path of Array.from(V.pages.keys())) {
    if (!path.startsWith(old + "/")) continue;
    const target = join(DIRS.orgs, path.slice(old.length + 1));
    const page = getPage(path), there = V.pages.has(target) ? getPage(target) : null;
    if (there) {
      there.blocks = (there.blocks || []).concat(page.blocks || []);
      there.props = there.props || {};
      for (const k of Object.keys(page.props || {})) if (!(k in there.props)) there.props[k] = page.props[k];
      touch(target);
    } else putPage(target, page);
    removePage(path);
    moved++;
  }
  if (moved) {
    rewriteLinkFolder("O", "o");
    notify("Moved " + moved + " organisation(s) from pages/O/ to pages/o/.");
  }
  return moved;
}
