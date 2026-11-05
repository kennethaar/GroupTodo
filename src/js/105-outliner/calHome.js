function calHome() {
  const names = Spaces.list.map(s => s.name);
  const mine = names.filter(n => LOADED.has(n) && !calAreaShared(n));
  const saved = PREF.get(CAL_HOME_KEY, "");
  if (mine.includes(saved)) return saved;
  if (mine.includes(Spaces.active)) return Spaces.active;
  const before = calFeeds().map(f => f.space).find(n => mine.includes(n));
  if (before) return before;
  return mine.find(n => /priv/i.test(n)) || mine[0] || (names.includes(Spaces.active) ? Spaces.active : "");
}
