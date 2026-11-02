function clDealt() {
  try {
    const o = JSON.parse(PREF.get("clarify.dealt", "") || "null");
    return new Set(o && o.week === solWeek() && Array.isArray(o.keys) ? o.keys : []);
  } catch (_) { return new Set(); }
}
