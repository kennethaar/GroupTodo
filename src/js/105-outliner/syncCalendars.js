async function syncCalendars({quiet = true} = {}) {
  const feeds = calFeeds();
  if (!feeds.length || CAL_SYNCING) return null;
  CAL_SYNCING = true;
  updateCalChips();
  const hadProblem = !!calendarProblem();
  PREF.set("calendar.tried", String(Date.now()));
  const [from, to] = calWindow();
  const sum = {added: 0, changed: 0, gone: 0}, failed = [];
  /* An area does not have to be on screen: it is read in behind your back,
     and flush() writes every area that is read in. */
  const open = async space => { if (Spaces.get(space) && !LOADED.has(space)) { try { await loadSpaceRecord(space); } catch (_) {} } return LOADED.has(space) && !calNotOnFolder(space); };
  const home = calHome();
  let shared = false;
  try {
    await filesLoaded();
    if (!home) failed.push("there is no area of your own to bring calendars into. Make one in Calendars");
    else if (!await open(home)) failed.push("your own area, " + home + ", could not be opened. Open it once from the area menu (a folder may need your permission again), then try again");
    else if (calAreaShared(home)) failed.push(calSharedWhy(home));
    else for (const f of feeds) {
      const name = f.label || calHost(f.url), feed = calFeedId(f.url);
      calNameFeed(feed, name);
      try {
        const text = await fetchCalendar(f.url);
        await filesLoaded();               // an area may have started reading while the link was fetched
        const r = importCalendarText(text, home, feed, from, to);
        for (const k in sum) sum[k] += r[k];
      } catch (e) { failed.push(name + ": " + (e.message || e)); continue; }
      // Every area a meeting of this calendar is to show in is read in first.
      const areas = new Set(calAlso(f));
      inSpace(home, () => { for (const p of allPages(isJournalPath)) walkBlocks(getPage(p).blocks, b => {
        if (blockProp(b, "cal_feed") === feed) calTargets(b, []).forEach(n => areas.add(n)); }); });
      for (const a of areas) if (a !== home && !await open(a)) failed.push(name + ": the area " + a + " could not be opened, so its meetings are not shown there yet");
      await filesLoaded();
      const r = routeCalendarMeetings(home, feed, calAlso(f), from, to);
      if (r.sent || r.taken) shared = true;
    }
  } finally { CAL_SYNCING = false; }
  PREF.set("calendar.result", JSON.stringify({at: Date.now(), ...sum, failed}));
  updateCalChips();
  /* Redrawn when meetings changed, or when the strip on Today should come or
     go; otherwise not, so a background import never pulls the caret out of a line. */
  if (sum.added || sum.changed || sum.gone || shared) { clearMemo(); flush(); }
  if (sum.added || sum.changed || sum.gone || shared || hadProblem !== (failed.length > 0)) render();
  const nothing = !sum.added && !sum.changed && !sum.gone;
  if (!quiet || sum.added) notify(calSummary(sum) + (failed.length ? " Not fetched: " + failed.join("; ") + "."
    : nothing ? " " + CAL_LAG_NOTE : ""), failed.length ? "warn" : "info");
  return {sum, failed};
}
