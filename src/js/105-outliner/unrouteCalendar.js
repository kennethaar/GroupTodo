/* An area taken off a calendar's "Also show in": the copies there go, except a
   meeting chosen for that area on its own, or one with something written under it. */
function unrouteCalendar(feed, space) {
  if (!LOADED.has(space)) return 0;
  return inSpace(space, () => calQuietly(() => {
    let n = 0;
    for (const p of allPages(isJournalPath)) {
      if (!dayOfPath(p)) continue;
      const page = getPage(p), hits = [];
      walkBlocks(page.blocks, b => { if (blockProp(b, "cal_feed") === feed && !calTargets(b, []).includes(space)) hits.push(b); });
      for (const b of hits) {
        if (calKept(b)) for (const k of ["cal_feed", "cal_uid", "cal_share", "branch_sync_id"]) setOrDropProp(b, k, "");
        else { removeBlockFrom(page, b); n++; }
        touchHere(p);
      }
    }
    return n;
  }));
}
