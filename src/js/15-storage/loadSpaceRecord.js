async function loadSpaceRecord(name) {
  const sp = Spaces.get(name);
  if (!sp) return null;
  const rec = LOADED.get(name) || newRecord(name, null);
  rec.backend = await spaceBackend(sp);
  await readInto(rec, {stage: true, onRest: restLoaded, onSoon: soonLoaded});
  LOADED.set(name, rec);
  reconcileSyncedPages(name);
  return rec;
}
