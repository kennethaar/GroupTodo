/* Where a finished thing is now. A line is found again by its words, and a
   project by its name, since a project changes folder with its status. */
function doneTarget(e) {
  if (e.space && e.space !== V.space && !LOADED.has(e.space)) return null;
  return inSpace(e.space, () => {
    if (e.kind === "project") {
      let path = getPage(e.path) ? e.path : null;
      if (!path) for (const p of V.pages.keys())
        if (baseName(p) === baseName(e.path) && pageKind(p) === "project") { path = p; break; }
      return path ? {path, page: getPage(path), block: null} : null;
    }
    const page = getPage(e.path);
    if (!page) return null;
    let hit = null, loose = null;
    walkBlocks(page.blocks, b => {
      if (b.title !== e.title || isMessage(b)) return;
      if (!hit && b.state === "DONE") hit = b; else if (!loose) loose = b;
    });
    return hit || loose ? {path: e.path, page, block: hit || loose} : null;
  });
}
