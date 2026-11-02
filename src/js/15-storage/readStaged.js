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
  const recent = new Set([0, 1, 2, 3].map(n => shiftISO(todayISO(), -n)));
  const later = p => isStubPath(p) ||
    (isJournalPath(p) && !recent.has((/(\d{4}-\d{2}-\d{2})\.md$/i.exec(p) || [])[1]));
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
  const weekAgo = shiftISO(todayISO(), -7);
  const soon = rest.filter(p => restRank(p, weekAgo) === 0), after = rest.filter(p => restRank(p, weekAgo) > 0);
  const tick = loadingTicker(record, rest.length);
  return {rest: (async () => {
    const files = new Map(first);
    if (soon.length) {
      const got = await record.backend.readMany(soon, tick);
      for (const [p, t] of got) files.set(p, t);
      if (record.stubs) { layInSoon(record, got, edited); if (onSoon) onSoon(record); }
    }
    for (const [p, t] of await record.backend.readMany(after, tick)) files.set(p, t);
    await readIntoNow(record, edited, files);
    if (onRest) onRest(record);
  })().catch(e => { record.restError = e; reportStorageTrouble(record, e); })
    .finally(() => loadingDone(record))};
}
