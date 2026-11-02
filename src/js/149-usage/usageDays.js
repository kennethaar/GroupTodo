function usageDays() {
  if (!USAGE.days) {
    try { USAGE.days = JSON.parse(PREF.get(USAGE_DAYS_KEY, "{}")) || {}; } catch (_) { USAGE.days = {}; }
  }
  return USAGE.days;
}
