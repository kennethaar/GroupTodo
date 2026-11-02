function estHint() {
  if (EST_HINTED) return;
  EST_HINTED = true;
  const seen = +PREF.get("est.hints", "0") || 0;
  if (seen >= 5) return;
  PREF.set("est.hints", String(seen + 1));
  notify("How long will it take? Type . .. or ... in front of a task's words, or pick the line (Esc) and press . once, twice or three times: 15, 30 or 45 minutes.");
}
