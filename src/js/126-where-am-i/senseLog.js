function senseLog() {
  try { const l = JSON.parse(PREF.get("sense.learn", "[]")); return Array.isArray(l) ? l : []; }
  catch (_) { return []; }
}
