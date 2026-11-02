/* Look-alikes in more than one area, folded into one in `dest`. Every copy
   not already there is brought in and merged into the one kept, which keeps
   its file name. An area it leaves where nobody else works just loses it; an
   area others share keeps a synced copy of the result -- the way a person is
   carried between areas -- so the project does not vanish from under them.
   One undo puts every file back; rewritten links stay, as with any merge. */
async function foldTwinsAcrossAreas(rows, keep, dest) {
  if (!LOADED.has(dest)) await loadSpaceRecord(dest);
  const snaps = new Map();
  const remember = (space, path) => {
    const k = JSON.stringify([space, path]);
    if (snaps.has(k)) return;
    const p = LOADED.get(space)?.pages.get(path);
    snaps.set(k, {space, path, text: p ? serializePage(p) : null});
  };
  const restore = () => {
    for (const x of snaps.values()) inSpace(x.space, () => {
      if (x.text === null) { if (V.pages.has(x.path)) removePage(x.path); }
      else { putPage(x.path, parsePage(x.text)); dropTombstone(x.path); touchHere(x.path); }
    });
    clearMemo(); flush(); render();
  };
  const destPages = LOADED.get(dest).pages;
  const freePath = path => {
    let p = path, i = 2;
    while (destPages.has(p)) p = path.replace(/\.md$/, "") + " " + i++ + ".md";
    return p;
  };
  for (const r of rows) remember(r.space, r.path);
  remember(dest, keep.path);
  try {
    // Every copy from elsewhere comes into dest, under a free name for now.
    const at = new Map();
    for (const r of rows) {
      if (r.space === dest) { at.set(r, r.path); continue; }
      const src = LOADED.get(r.space)?.pages.get(r.path);
      if (!src) throw new Error(r.title + " is no longer in " + r.space + ".");
      await copyTransferAssets(src, r.space, dest);
      const copy = parsePage(serializePage(src));
      delete copy.props.space_sync_id;
      delete copy.props.space_sync_peers;
      const p = freePath(r.path);
      remember(dest, p);
      inSpace(dest, () => putPage(p, copy));
      at.set(r, p);
    }
    const into = at.get(keep);
    let final = into;
    inSpace(dest, () => {
      // A copy brought in only for this never existed there: no headstone for it.
      for (const r of rows) if (r !== keep) mergePageInto(at.get(r), into, {temp: r.space !== dest, undo: false});
      if (into !== keep.path && !V.pages.has(keep.path) && moveFile(into, keep.path)) final = keep.path;
    });
    const synced = [];
    for (const space of new Set(rows.filter(r => r.space !== dest).map(r => r.space))) {
      inSpace(space, () => { for (const r of rows) if (r.space === space) removePage(r.path); });
      if (!othersIn(space).length) continue;
      if (LOADED.get(space).pages.has(final)) throw new Error(final + " is already in " + space + ".");
      remember(space, final);
      inSpace(space, () => dropTombstone(final));
      if (!await copyPagesToSpace([{path: final, from: dest}], space, {mode: "sync", inner: true}))
        throw new Error("The synced copy in " + space + " could not be saved.");
      synced.push(space);
    }
    await flush();
    if ([...LOADED.values()].some(r => r.dirty.size || r.removed.size))
      throw new Error("The fold could not be saved completely.");
    pushUndo({run: () => { restore(); return true; }});
    const title = inSpace(dest, () => pageTitle(final));
    notify((rows.length - 1) + " folded into " + title + " in " + dest + "." +
      (synced.length ? " " + synced.join(" and ") + " keep" + (synced.length === 1 ? "s" : "") +
        " a synced copy for the others there." : ""),
      "info", {label: "Undo", run: () => { restore(); return true; }});
    return true;
  } catch (e) {
    restore();
    await flush();
    notify("Nothing was folded: " + e.message, "error");
    return false;
  }
}
