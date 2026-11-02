function jwShares() {
  try { const o = JSON.parse(PREF.get("today.jwidths", "{}")); return o && typeof o === "object" ? o : {}; }
  catch (_) { return {}; }
}
