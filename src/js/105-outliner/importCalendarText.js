function importCalendarText(text, space, feed, fromMs, toMs) {
  const hm = ms => { const d = new Date(ms); return pad2(d.getHours()) + ":" + pad2(d.getMinutes()); };
  /* The same meeting listed twice by the calendar comes in once. Some calendars
     also give a meeting a new UID on a later fetch; it is then known by its
     title, day and time, and the line already there takes the new key. */
  const sig = (title, day, time) => title + "\n" + day + "\n" + time;
  const meetings = [], sigs = new Set();
  for (const o of icsMeetings(text, fromMs, toMs)) {
    const s = sig(o.summary, o.start, o.allDay ? "" : o.end);
    if (!sigs.has(s)) { sigs.add(s); meetings.push(o); }
  }
  const keys = new Set(meetings.map(o => o.key));
  const firstDay = isoOf(new Date(fromMs)), lastDay = isoOf(new Date(toMs));
  const kept = calKept;
  return inSpace(space, () => calQuietly(() => {
    dropOldCalSkips();
    let added = 0, changed = 0, gone = 0;
    const have = new Map(), skip = new Set();
    for (const p of allPages(isJournalPath)) {
      const d = dayOfPath(p);
      // Indented under another line is still on the page: not to be imported again.
      if (d) walkBlocks(getPage(p).blocks, b => {
        if (blockProp(b, "cal_feed") === feed) have.set(blockProp(b, "cal_uid"), {path: p, b, d});
      });
      calSkipsOf(p, skip);
    }
    // Lines whose key the calendar no longer gives, by what they say.
    const loose = new Map();
    for (const [k, x] of have) if (!keys.has(k)) {
      const s = sig(x.b.title, x.d, blockProp(x.b, "time") || "");
      (loose.get(s) || loose.set(s, []).get(s)).push(k);
    }
    const seen = new Set(), days = new Set();
    for (const o of meetings) {
      const title = "#meeting " + (o.cancelled ? "Cancelled: " : "") + o.summary.replace(/^cancel(l)?ed:\s*/i, "");
      const time = o.allDay ? "" : hm(o.start) + (o.end > o.start ? "–" + hm(o.end) : "");
      const lookDay = isoOf(new Date(o.start)) + calLook(title, time);
      seen.add(o.key);
      let hit = have.get(o.key);
      const old = !hit && (loose.get(sig(title, isoOf(new Date(o.start)), time)) || []).shift();
      if (old) {
        hit = have.get(old);
        have.delete(old); have.set(o.key, hit);
        setBlockProp(hit.b, "cal_uid", o.key);
        touch(hit.path); changed++;
      }
      // Deleted, or cut to somewhere else: not brought back.
      if (!hit && (o.cancelled || skip.has(o.key) || skip.has(lookDay))) continue;
      const att = o.people.map(p => linkKnownNames(p)).join(", ");
      const path = ensureJournal(isoOf(new Date(o.start))), page = getPage(path);
      days.add(path);
      if (!hit) {
        const b = newBlock({title, children: o.agenda.map(a => newBlock({title: a}, false))}, false);
        b.props = {cal_uid: o.key, cal_feed: feed};
        if (time) b.props.time = time;
        if (att) b.props.attendees = att;
        page.blocks.push(b);
        touch(path); added++;
        continue;
      }
      const b = hit.b, was = [b.title, blockProp(b, "time"), blockProp(b, "attendees")].join("\n");
      // Moved to another day in the calendar; one you moved yourself stays where you put it.
      if (hit.path !== path && !skip.has(o.key)) {
        removeBlockFrom(getPage(hit.path), b);
        page.blocks.push(b);
        touch(hit.path); touch(path); changed++;
      }
      b.title = title; setOrDropProp(b, "time", time); setOrDropProp(b, "attendees", att);
      if ([b.title, blockProp(b, "time"), blockProp(b, "attendees")].join("\n") !== was) { touch(path); touch(hit.path); changed++; }
    }
    for (const [key, hit] of have) {
      if (seen.has(key) || hit.d < firstDay || hit.d >= lastDay) continue;
      if (!kept(hit.b)) removeBlockFrom(getPage(hit.path), hit.b);
      else if (!/^#meeting Cancelled:/.test(hit.b.title)) hit.b.title = hit.b.title.replace(/^#meeting /, "#meeting Cancelled: ");
      else continue;
      touch(hit.path); gone++;
    }
    /* cal_deleted:: is not pruned against what came in. This import is one
       calendar's: pruning took the deletes of every other calendar's meetings
       off the line, and their import brought them back. A calendar that leaves
       a meeting out of one fetch and has it back in the next did the same. */
    // A calendar lists its meetings in whatever order it keeps them, so each day's are put in time order.
    for (const path of days) calSortDay(path);
    return {added, changed, gone};
  }));
}
