/* ---------- the old file of a moved project ----------
   A move writes the page into its new folder and deletes the old file. When
   the delete did not land -- OneDrive holding the file open, the tab closed
   before the save finished, or a build before moves left a headstone -- the
   next load found the project on two shelves, the review dealt it out from
   the old one again, and moving it "merged" two copies of the same page with
   0 lines coming across.

   So on the way in, two kinds of file are taken out and deleted again:
   - one this area has a headstone for and that is no newer than the
     headstone: it was already deleted here. A file with no updated:: at all
     was written by hand, not by the app, and is left alone.
   - the older of a project that sits on two status shelves, when it has no
     line the newer one lacks: it is the leftover of a move. One with lines of
     its own stays for the review to merge, so nothing written is lost. */
function dropLeftovers(record) {
  const tomb = new Map();
  for (const part of String(record.pages.get(SETTINGS_PATH)?.props?.deleted || "").split(";")) {
    const [p, t] = part.split("@");
    if (p && t) tomb.set(trim(p), trim(t));
  }
  const stamp = page => String(page?.props?.updated || "");
  const drop = new Set();
  for (const [path, page] of record.pages) {
    const at = tomb.get(path);
    if (at && stamp(page) && stamp(page) <= at) drop.add(path);
  }

  const shelves = new Map();
  for (const path of record.pages.keys()) {
    const code = statusDirOf(path);
    if (code == null || drop.has(path) || path !== join(STATUS_DIRS[code], baseName(path) + ".md")) continue;
    const key = baseName(path).toLowerCase();
    if (!shelves.has(key)) shelves.set(key, []);
    shelves.get(key).push(path);
  }
  for (const paths of shelves.values()) {
    if (paths.length < 2) continue;
    paths.sort((a, b) => stamp(record.pages.get(b)).localeCompare(stamp(record.pages.get(a))));
    const keep = record.pages.get(paths[0]);
    const have = new Set();
    walkBlocks(keep.blocks, b => { have.add(mergeLineKey(b)); });
    for (const path of paths.slice(1)) {
      const page = record.pages.get(path);
      if (stamp(page) === stamp(keep)) continue;           // no telling which is the newer
      let own = false;
      walkBlocks(page.blocks, b => { if (trim(b.title) && !have.has(mergeLineKey(b))) own = true; });
      if (!own) drop.add(path);
    }
  }

  for (const path of drop) {
    record.pages.delete(path);
    record.dirty.delete(path);
    record.removed.add(path);
  }
  return drop.size;
}
