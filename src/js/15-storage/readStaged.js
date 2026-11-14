async function readStaged(record, edited, onRest, onSoon) {
  const today = todayISO();   // the first read is today alone: the rest of the month follows
  /* The day folders and the folders read last are listed after the first
     draw (listedLate), only where a full read on this device has counted the
     other pages: the empty-folder alarm needs a count to hold the first
     listing against (#181). */
  const pagesKey = "pagecount-pages:" + record.name;
  const defer = !!record.backend.laterNames && Number(PREF.get(pagesKey, "0")) >= 3;   // as looksEmptied needs
  const who = "“" + record.name + "”: ";
  let t = loadMark(who + "listing the folder" + (defer ? ", today's page by name" : ""));
  let paths;
  try { paths = await record.backend.names(defer ? {today, late: LATE_DIRS} : undefined); }
  catch (e) {
    if (!/NotFound/i.test((e && e.name) || "")) throw e;
    holdRecord(record, "missing", 0);
    return null;
  }
  const counted = p => !isGuidePath(p) && !isLangPath(p) && !isPromptPath(p) && /\.md$/i.test(p);
  loadMark(who + "listed " + paths.length + " files", t);
  const seen = paths.filter(p => counted(p) && !(defer && listedLate(p))).length;
  const key = defer ? pagesKey : "pagecount:" + record.name;
  if (looksEmptied(record, seen, key)) { holdRecord(record, "empty", seen, key); return null; }
  const unlisted = defer && record.backend.hasLater();
  const later = p => isStubPath(p) ||
    (isJournalPath(p) && (/(\d{4}-\d{2}-\d{2})\.md$/i.exec(p) || [])[1] !== today);
  const rest = paths.filter(later);
  const firstPaths = paths.filter(p => !later(p));
  t = performance.now();
  const first = await record.backend.readMany(firstPaths);
  loadMark(who + "read " + firstPaths.length + " files first (today, the horizons, " + rest.length + " to follow)", t);
  if (!rest.length && !unlisted) {
    t = performance.now();
    await readIntoNow(record, edited, first);
    loadMark(who + "all " + record.pages.size + " pages in", t);
    return null;
  }

  record.hold = null;
  record.stubs = new Set();
  record.later = later;                // what may still come in: mergeMirror waits for those alone
  fillRecord(record, first);
  const standIn = p => {
    if (!isStubPath(p) || isGuidePath(p) || syncCopyOf(p)) return;   // a guide or a planning draft is no page to stand in for
    if (record.pages.has(p)) return;   // made here while its folder was not yet listed: merged with its file when saved
    const page = parsePage("");
    STUB_PAGES.add(page);
    record.pages.set(p, page);
    record.stubs.add(p);
  };
  rest.forEach(standIn);
  applyVaultCss(record);
  loadMark(who + "today's page is in; " + rest.length + " pages stand in by name");
  // Wrapped: an async function hands back a promise it returns only once it settles.
  /* A read that stops leaves the stand-ins standing, still never written:
     taken for pages, an empty one went over its file at the next save (#188).
     A full read again (Check the folder) puts them right; readIntoNow lets
     them go once every file is in. */
  const tick = loadingTicker(record, rest.length);
  const listLate = async pick => {
    const t = performance.now();
    const more = (await record.backend.laterNames(pick)).filter(later);
    if (record.stubs) more.forEach(standIn);
    tick.add(more.length);
    loadMark(who + "listed " + more.length + " more files late", t);
    return more;
  };
  return {rest: (async () => {
    // The day folders, listed now that the day is on screen.
    if (unlisted) rest.push(...await listLate(isJournalPath));
    const monthAgo = shiftISO(today, -SHOWN_DAYS);
    const ordered = restOrder(rest);
    const rankOf = new Map(ordered.map(p => [p, restRank(p, monthAgo)]));
    const soon = Array.from({length: SHOWN_RANKS}, (_, n) => ordered.filter(p => rankOf.get(p) === n));
    const files = new Map(first);
    for (const group of soon) {
      if (!group.length) continue;
      const t = performance.now();
      const got = await record.backend.readMany(group, tick);
      loadMark(who + "read " + group.length + " files of the week and active work", t);
      for (const [p, t] of got) files.set(p, t);
      if (record.stubs) { layInSoon(record, got, edited); if (onSoon) onSoon(record); }
    }
    // Done and cancelled projects, notes, mail and reviews: listed last, then read.
    if (unlisted) {
      const more = await listLate(() => true);
      if (more.length && onSoon) onSoon(record);   // there by name
      rest.push(...more);
    }
    const after = restOrder(rest).filter(p => restRank(p, monthAgo) >= SHOWN_RANKS);
    t = performance.now();
    for (const [p, t] of await record.backend.readMany(after, tick)) files.set(p, t);
    loadMark(who + "read the other " + after.length + " files", t);
    t = performance.now();
    await readIntoNow(record, edited, files);
    loadMark(who + "all " + record.pages.size + " pages in", t);
    t = performance.now();
    if (onRest) onRest(record);
    if (onRest) loadMark(who + "brought up to date and drawn again", t);
  })().catch(e => { record.restError = e; reportStorageTrouble(record, e); })
    .finally(() => loadingDone(record))};
}
