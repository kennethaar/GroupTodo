/* One calendar's meetings, from your own area into the other areas they are
   to show in, as synced copies (branch_sync_id::): what is written under one
   is written under the other. Where somebody else's import of the same meeting
   is already, it is not shown twice. A copy no longer wanted somewhere -- the
   meeting left the calendar, or was taken out of that area -- goes, unless
   something was written under it: then it stays as a plain #meeting line. */
function routeCalendarMeetings(home, feed, also, fromMs, toMs, only = null) {
  const firstDay = isoOf(new Date(fromMs)), lastDay = isoOf(new Date(toMs));
  const inWindow = d => d && d >= firstDay && d < lastDay;
  const dayBlocks = fn => { for (const p of allPages(isJournalPath)) { const d = dayOfPath(p); if (inWindow(d)) walkBlocks(getPage(p).blocks, b => { fn(b, p, d); }); } };
  const mine = new Map();
  inSpace(home, () => dayBlocks((b, path, d) => { if (blockProp(b, "cal_feed") === feed) mine.set(blockProp(b, "cal_uid"), {b, path, d}); }));
  const r = {sent: 0, taken: 0};
  const letGo = (x, gone) => {
    if (gone && calKept(x.b) && /^#meeting Cancelled:/.test(x.b.title)) return;
    if (!calKept(x.b)) removeBlockFrom(getPage(x.path), x.b);
    else if (gone) x.b.title = x.b.title.replace(/^#meeting /, "#meeting Cancelled: ");
    else for (const k of ["cal_feed", "cal_uid", "cal_share", "branch_sync_id"]) setOrDropProp(x.b, k, "");
    touchHere(x.path); r.taken++;
  };
  for (const space of only ? [only] : [...LOADED.keys()]) {
    if (space === home || !LOADED.has(space)) continue;
    inSpace(space, () => calQuietly(() => {
      dropOldCalSkips();
      const there = new Map(), synced = new Map(), days = new Set(), skip = new Set();
      dayBlocks((b, path, d) => {
        const k = blockProp(b, "cal_uid");
        if (!k) return;
        const x = {b, path, d, k};
        (there.get(k) || there.set(k, []).get(k)).push(x);
        if (blockProp(b, "cal_feed") === feed && blockProp(b, "branch_sync_id")) synced.set(blockProp(b, "branch_sync_id"), x);
      });
      // A copy deleted or moved in this area is not sent again, nor moved back.
      for (const p of allPages(isJournalPath)) calSkipsOf(p, skip);
      for (const [k, m] of mine) {
        // The calendar gave the meeting a new key: its copy here takes it too.
        const was = !there.has(k) && synced.get(blockProp(m.b, "branch_sync_id"));
        if (was && !mine.has(was.k)) {
          const list = there.get(was.k);
          list.splice(list.indexOf(was), 1);
          setBlockProp(was.b, "cal_uid", k); was.k = k;
          there.set(k, [was]);
          touchHere(was.path);
        }
        const all = there.get(k) || [];
        // Ours: this calendar's, here (a synced copy, or from when this was your own area).
        const copy = all.find(x => blockProp(x.b, "cal_feed") === feed);
        const want = calTargets(m.b, also).includes(space);
        if (want && !copy) {
          if (all.length || skip.has(k) || skip.has(m.d + calLook(m.b.title, blockProp(m.b, "time")))) continue;
          const id = blockProp(m.b, "branch_sync_id") || uid();
          if (!blockProp(m.b, "branch_sync_id")) { m.b.props.branch_sync_id = id; inSpace(home, () => touchHere(m.path)); }
          const c = cloneBlock(m.b);
          const path = ensureJournal(m.d);
          getPage(path).blocks.push(c);
          touchHere(path); days.add(path); r.sent++;
        } else if (want) {
          if (blockProp(copy.b, "branch_sync_id") !== blockProp(m.b, "branch_sync_id")) {
            // Written under before it was a copy: left as it is rather than overwritten.
            if (calKept(copy.b)) continue;
            const id = blockProp(m.b, "branch_sync_id") || uid();
            m.b.props.branch_sync_id = id; inSpace(home, () => touchHere(m.path));
            Object.assign(copy.b, cloneBlock(m.b), {id: copy.b.id});
            touchHere(copy.path); r.sent++;
          }
          if (copy.d !== m.d && !skip.has(k)) {   // the meeting moved to another day
            removeBlockFrom(getPage(copy.path), copy.b);
            const path = ensureJournal(m.d);
            getPage(path).blocks.push(copy.b);
            touchHere(copy.path); touchHere(path); days.add(path); r.sent++;
          }
        } else if (copy && calOwnShare(m.b)) letGo(copy, false);
      }
      for (const [k, list] of there)
        if (!mine.has(k)) for (const x of list) if (blockProp(x.b, "cal_feed") === feed) letGo(x, true);
      for (const path of days) calSortDay(path);
    }));
  }
  return r;
}
