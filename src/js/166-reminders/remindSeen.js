function remindSeen() {
  try { return JSON.parse(PREF.get(REMIND_PREF, "{}")) || {}; } catch (_) { return {}; }
}
