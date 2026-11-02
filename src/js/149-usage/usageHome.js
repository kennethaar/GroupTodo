/* Your own area, as the calendar has one: the one chosen here, or the
   calendar's, as long as nobody else is in it. */
function usageHome() {
  const ok = n => !!n && LOADED.has(n) && !calAreaShared(n);
  const saved = PREF.get(USAGE_HOME_KEY, "");
  if (Spaces.list.some(s => s.name === saved) && ok(saved)) return saved;
  const cal = calHome();
  return ok(cal) ? cal : "";
}
