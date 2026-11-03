function navIdOf(name) {
  const s = trim(plainTitle(String(name || ""))).toLowerCase();
  const it = navEntries().find(x => x.id === s || x.label.toLowerCase() === s);
  return it ? it.id : null;
}
