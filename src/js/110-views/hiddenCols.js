function hiddenCols(by) {
  try { return new Set(JSON.parse(PREF.get(hiddenColsKey(by), "[]"))); }
  catch (_) { return new Set(); }
}
