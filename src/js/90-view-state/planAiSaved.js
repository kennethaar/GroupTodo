/* Addresses typed in by hand, newest first, offered in every area after. */
function planAiSaved() {
  try { const l = JSON.parse(PREF.get("plan.ais", "[]")); return Array.isArray(l) ? l.filter(u => typeof u === "string") : []; }
  catch (_) { return []; }
}
