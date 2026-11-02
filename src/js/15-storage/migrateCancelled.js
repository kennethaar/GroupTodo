/* Cancelled projects used to share pages/_/ with the horizon pages. Move them to
   pages/-/ so the underscore drawer is horizons alone. A horizon page is left
   where it is, and so is anything the type property says is a horizon, because
   that is the only thing that ever told the two apart. */
function migrateCancelled() {
  const old = join(PAGES, "_");
  let moved = 0;
  for (const path of Array.from(V.pages.keys())) {
    if (!path.startsWith(old + "/")) continue;
    if (isHorizonPage(path)) continue;
    const rest = path.slice(old.length + 1);
    // A horizon page an older build wrote without the type property.
    if (HORIZONS.some(h => h.page && h.page + ".md" === rest)) continue;
    // What the area's journal is for, written by hand without type:: horizon (#185).
    if (rest === "Intentions.md") continue;
    const target = join(DIRS.cancelled, rest);
    if (V.pages.has(target)) { removePage(path); continue; }
    const page = getPage(path);
    // The status line says the directory it is in, and the directory changed.
    if (page.props && page.props.status) page.props.status = STATUS_TEXT["-"];
    putPage(target, page);
    removePage(path);
    moved++;
  }
  if (moved) {
    rewriteCancelledLinks();
    notify("Moved " + moved + " cancelled project(s) to pages/-/.");
  }
  return moved;
}
