async function readStaged(record, edited, onRest, onSoon) {
  let paths;
  try { paths = await record.backend.names(); }
  catch (e) {
    if (!/NotFound/i.test((e && e.name) || "")) throw e;
    holdRecord(record, "missing", 0);
    return null;
  }
  const seen = paths.filter(p => !isGuidePath(p) && !isLangPath(p) && !isPromptPath(p) && /\.md$/i.test(p)).length;
  if (looksEmptied(record, seen)) { holdRecord(record, "empty", seen); return null; }
  const today = todayISO();   // the first read is today alone: the rest of the month follows
  const later = p => isStubPath(p) ||
    (isJournalPath(p) && (/(\d{4}-\d{2}-\d{2})\.md$/i.exec(p) || [])[1] !== today);
  const rest = restOrder(paths.filter(later));
  const first = await record.backend.readMany(paths.filter(p => !later(p)));
  if (!rest.length) { await readIntoNow(record, edited, first); return null; }

  record.hold = null;
  record.stubs = new Set();
  fillRecord(record, first);
  for (const p of rest) {
    if (!isStubPath(p) || isGuidePath(p) || syncCopyOf(p)) continue;   // a guide or a planning draft is no page to stand in for
    const page = parsePage("");
    STUB_PAGES.add(page);
    record.pages.set(p, page);
    record.stubs.add(p);
  }
  applyVaultCss(record);
  // Wrapped: an async function hands back a promise it returns only once it settles.
  /* A read that stops leaves the stand-ins standing, still never written:
     taken for pages, an empty one went over its file at the next save (#188).
     A full read again (Check the folder) puts them right; readIntoNow lets
     them go once every file is in. */
  const monthAgo = shiftISO(todayISO(), -SHOWN_DAYS);
  const rankOf = new Map(rest.map(p => [p, restRank(p, monthAgo)]));
  const soon = Array.from({length: SHOWN_RANKS}, (_, n) => rest.filter(p => rankOf.get(p) === n));
  const after = rest.filter(p => rankOf.get(p) >= SHOWN_RANKS);
  const tick = loadingTicker(record, rest.length);
  return {rest: (async () => {
    const files = new Map(first);
    for (const group of soon) {
      if (!group.length) continue;
      const got = await record.backend.readMany(group, tick);
      for (const [p, t] of got) files.set(p, t);
      if (record.stubs) { layInSoon(record, got, edited); if (onSoon) onSoon(record); }
    }
    for (const [p, t] of await record.backend.readMany(after, tick)) files.set(p, t);
    await readIntoNow(record, edited, files);
    if (onRest) onRest(record);
  })().catch(e => { record.restError = e; reportStorageTrouble(record, e); })
    .finally(() => loadingDone(record))};
}
