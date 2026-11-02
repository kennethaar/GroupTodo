function doneHistory() {
  try { return JSON.parse(PREF.get("done.history", "[]")) || []; } catch (_) { return []; }
}
