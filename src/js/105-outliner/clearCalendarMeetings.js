/* Take one calendar's meetings off an area's day pages, every day of them.
   One you wrote under stays, as a plain #meeting line the calendar no longer
   touches. Undo puts the pages back as they were. */
function clearCalendarMeetings(space, feed) {
  return inSpace(space, () => calQuietly(() => {
    let removed = 0, kept = 0;
    const before = new Map();
    for (const p of allPages(isJournalPath)) {
      if (!dayOfPath(p)) continue;
      const page = getPage(p), hits = [];
      walkBlocks(page.blocks, b => { if (blockProp(b, "cal_feed") === feed) { hits.push(b); return false; } });
      if (!hits.length) continue;
      before.set(p, (page.blocks || []).map(cloneBlock));
      for (const b of hits) {
        if (calKept(b)) { setOrDropProp(b, "cal_feed", ""); setOrDropProp(b, "cal_uid", ""); kept++; }
        else { removeBlockFrom(page, b); removed++; }
      }
      touch(p);
    }
    const undo = () => inSpace(space, () => calQuietly(() => {
      for (const [p, blocks] of before) { const pg = getPage(p); if (pg) { pg.blocks = blocks.map(cloneBlock); touch(p); } }
    }));
    return {removed, kept, undo};
  }));
}
