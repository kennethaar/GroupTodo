/* ---------- the lines a sheet counts ---------- */
function sheetTrackers(S) {
  if (S.source) return [];
  const only = sheetSetting(S, "trackers").toLowerCase().split(/[\s,;]+/).filter(Boolean);
  const all = trackerList().filter(g => g.code === S.letter).map(g => g.name);
  return only.length ? all.filter(n => only.includes(n)) : all;
}
