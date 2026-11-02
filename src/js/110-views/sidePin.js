function sidePin() {
  try { const p = JSON.parse(PREF.get("sidepin", "null")); return p && p.path ? p : null; }
  catch (_) { return null; }
}
