/* ---------- synced copies ----------
   A page synced into other spaces carries space_sync_id:: and the list of
   spaces holding it in space_sync_peers::. A synced line carries
   branch_sync_id::. An edit to one is written into the others that are
   loaded; a space loaded later catches up from the newest copy. */
function syncPageCopies(path, home) {
  const page = LOADED.get(home)?.pages.get(path);
  if (!page?.props?.space_sync_id) return;
  let peers;
  try { peers = JSON.parse(page.props.space_sync_peers || "[]"); } catch (_) { return; }
  for (const name of peers) {
    if (name === home) continue;
    const other = LOADED.get(name), existing = other?.pages.get(path);
    if (!existing || existing.props?.space_sync_id !== page.props.space_sync_id) continue;
    const fresh = parsePage(serializePage(page));
    // Keep the page object itself, so an outline already on screen is not left holding a stale one.
    existing.props = fresh.props;
    existing.blocks = fresh.blocks;
    other.dirty.add(path);
  }
  clearMemo();
}
