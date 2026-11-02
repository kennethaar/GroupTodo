/* Runs of single days kept written ahead, and the ones gone by tidied away.
   Run at start-up and whenever the Trackers page is drawn; it writes nothing
   while a run still reaches two months on. */
function topUpTrackerSeries() {
  const today = todayISO(), horizon = shiftISO(today, SERIES_AHEAD);
  for (const sp of LOADED.keys()) if (!folderWaiting(sp)) inSpace(sp, () => {
    const lists = allPages(p => p.startsWith(DIRS.lists + "/") && isDateName(baseName(p)));
    const names = new Set();
    for (const p of lists) walkBlocks(getPage(p).blocks, b => { const t = parseTracker(b.title); if (t) names.add(t.name); });
    for (const name of names) {
      const w = trackerWhen(name);
      if (!w.when || !/^n(days|weeks)$/.test(w.when.mode) || !w.key || !w.last || w.last >= shiftISO(today, SERIES_TOPUP)) continue;
      const more = seriesDates(w.when, shiftISO(w.last, 1), horizon);
      inSpace(w.space, () => {
        for (const d of more) addTrackerLine(d, w.key);
        syncTrackerDays(name, w.key, new Set(more));
      });
    }
    for (const p of lists) {
      const page = getPage(p);
      if (page && baseName(p) < shiftISO(today, -SERIES_KEEP) && onlyTrackers(page)) removePage(p);
    }
  });
}
