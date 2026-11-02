function calHome() {
  const names = Spaces.list.map(s => s.name);
  const saved = PREF.get(CAL_HOME_KEY, "");
  if (names.includes(saved)) return saved;
  const before = calFeeds().map(f => f.space).find(n => names.includes(n));
  if (before) return before;
  const mine = names.filter(n => LOADED.has(n) && !calAreaShared(n));
  return mine.find(n => /priv/i.test(n)) || (mine.includes(Spaces.active) ? Spaces.active : mine[0]) || "";
}
