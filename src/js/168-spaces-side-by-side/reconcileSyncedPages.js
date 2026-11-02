/* After a space is (re)loaded, every synced page in it is brought level with
   the most recently edited copy, wherever that copy is. */
function reconcileSyncedPages(name) {
  for (const [path, page] of LOADED.get(name)?.pages || []) {
    const id = page.props?.space_sync_id;
    if (!id) continue;
    let newest = name, stamp = String(page.props.updated || "");
    for (const [home, rec] of LOADED) {
      const p = rec.pages.get(path);
      if (p?.props?.space_sync_id === id && String(p.props.updated || "") > stamp) {
        newest = home;
        stamp = String(p.props.updated || "");
      }
    }
    syncPageCopies(path, newest);
  }
}
