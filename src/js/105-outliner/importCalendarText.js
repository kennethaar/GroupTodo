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
    const have = new Map(), skips = new Map();
    const gather = (name, own) => {
      const skip = new Set();
      for (const p of allPages(isJournalPath)) {
        const d = dayOfPath(p);
        // Indented under another line is still on the page: not to be imported again.
        if (d) walkBlocks(getPage(p).blocks, b => {
          const k = blockProp(b, "cal_uid");
          if (blockProp(b, "cal_feed") === feed && (own || blockProp(b, "cal_moved") && !have.has(k)))
            have.set(k, {path: p, b, d, space: name});
        });
        calSkipsOf(p, skip);
      }
      skips.set(name, skip);
    };
    gather(space, true);
    // One moved out to another area is kept up to date there (#61).
    for (const name of LOADED.keys()) if (name !== space) inSpace(name, () => gather(name, false));
    const skip = skips.get(space);
    // Run where the line is; another area's edits are the importer's own too.
    const at = (name, fn) => name === space ? fn() : inSpace(name, () => calQuietly(fn));
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
      const day = isoOf(new Date(o.start)), lookDay = day + calLook(title, time);
      seen.add(o.key);
      let hit = have.get(o.key);
      /* A meeting moved to another area knows its calendar entry (cal_moved::),
         so a one-time meeting given a new time is still found there. */
      const old = !hit && ((loose.get(sig(title, day, time)) || []).shift() || !o.repeats &&
        [...have].find(([k, x]) => x.space !== space && !keys.has(k) && blockProp(x.b, "cal_moved") === o.series)?.[0]);
      if (old && have.has(old)) {
        hit = have.get(old);
        have.delete(old); have.set(o.key, hit);
        at(hit.space, () => { setBlockProp(hit.b, "cal_uid", o.key); touch(hit.path); });
        changed++;
      }
      if (hit && hit.space !== space && blockProp(hit.b, "cal_moved") !== o.series)
        at(hit.space, () => { hit.b.props.cal_moved = o.series; touch(hit.path); });
      // Deleted, or cut to somewhere else: not brought back.
      if (!hit && (o.cancelled || skip.has(o.key) || skip.has(lookDay))) continue;
      const att = o.people.map(p => linkKnownNames(p)).join(", ");
      const where = hit ? hit.space : space;
      const path = at(where, () => ensureJournal(day));
      days.add(JSON.stringify([where, path]));
      if (!hit) {
        const b = newBlock({title, children: o.agenda.map(a => newBlock({title: a}, false))}, false);
        b.props = {cal_uid: o.key, cal_feed: feed};
        if (time) b.props.time = time;
        if (att) b.props.attendees = att;
        if (o.join) b.props.join = o.join;
        getPage(path).blocks.push(b);
        touch(path); added++;
        continue;
      }
      at(where, () => {
        const look = () => [b.title, blockProp(b, "time"), blockProp(b, "attendees"), blockProp(b, "join")].join("\n");
        const b = hit.b, was = look();
        // Moved to another day in the calendar; one you moved yourself stays where you put it.
        if (hit.path !== path && !skips.get(where).has(o.key)) {
          removeBlockFrom(getPage(hit.path), b);
          getPage(path).blocks.push(b);
          touch(hit.path); touch(path); changed++;
        }
        b.title = title; setOrDropProp(b, "time", time); setOrDropProp(b, "attendees", att);
        setOrDropProp(b, "join", o.join);
        if (look() !== was) { touch(path); touch(hit.path); changed++; }
      });
    }
    for (const [key, hit] of have) {
      if (seen.has(key) || hit.d < firstDay || hit.d >= lastDay) continue;
      at(hit.space, () => {
        if (!kept(hit.b)) removeBlockFrom(getPage(hit.path), hit.b);
        else if (!/^#meeting Cancelled:/.test(hit.b.title)) hit.b.title = hit.b.title.replace(/^#meeting /, "#meeting Cancelled: ");
        else return;
        touch(hit.path); gone++;
      });
    }
    /* cal_deleted:: is not pruned against what came in. This import is one
       calendar's: pruning took the deletes of every other calendar's meetings
       off the line, and their import brought them back. A calendar that leaves
       a meeting out of one fetch and has it back in the next did the same. */
    // A calendar lists its meetings in whatever order it keeps them, so each day's are put in time order.
    for (const k of days) { const [name, path] = JSON.parse(k); at(name, () => calSortDay(path)); }
    return {added, changed, gone};
  }));
}
