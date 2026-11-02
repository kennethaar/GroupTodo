function hiddenStates() {
  try { return new Set(JSON.parse(PREF.get("hideStates:" + (Spaces.active || ""), "[]"))); }
  catch (_) { return new Set(); }
}
