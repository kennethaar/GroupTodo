function tapIcon(t) {
  const own = tapIcons(t.raw)[0];
  if (own) return own;
  const page = trackerProp(t.name, "icon");
  if (page) return page;
  const set = trim(getSetting(tapIconKey(t.name)) || "");
  if (set) return set;
  const prev = trackerEntries().filter(e => e.name === t.name && e.code === "i" && tapIcons(e.raw)[0]).pop();
  return prev ? tapIcons(prev.raw)[0] : "\u25CF";
}
