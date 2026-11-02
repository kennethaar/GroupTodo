function addTombstone(path) {
  if (path === SETTINGS_PATH) return;
  const t = tombstones();
  t.set(path, nowStamp());
  writeTombstones(t);
}
