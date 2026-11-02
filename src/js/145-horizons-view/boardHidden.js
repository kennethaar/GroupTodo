function boardHidden(mode) {
  try { return new Set(JSON.parse(PREF.get(boardFilterKey(mode), "[]"))); }
  catch (_) { return new Set(); }
}
