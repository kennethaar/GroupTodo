/* Remove a whole page, remembering it. */
function deletePageWithUndo(path) {
  const page = getPage(path);
  if (!page) return;
  const copy = clonePage(page);
  const space = Spaces.active;
  removePage(path);
  render();

  const restore = () => {
    let ok = false;
    inSpace(space, () => {
      if (V.pages.has(path)) { notify("That page is back already.", "warn"); return; }
      V.removed.delete(path);
      dropTombstone(path);
      putPage(path, clonePage(copy));
      ok = true;
    });
    if (ok) { render(); notify("Put “" + pageTitle(path) + "” back."); }
    return ok;
  };
  pushUndo({run: restore, label: "Deleted " + pageTitle(path)});
  notify("Deleted " + pageTitle(path) + ".", "info", {label: "Undo", run: restore});
}
