function nextTwins() {
  return memo("nextTwins", () => {
    const all = nextActions().filter(a => !a.tourStep)
      .map(a => ({space: a.space, path: a.path, block: a.block, project: a.project, title: plainTitle(a.title)}));
    const key = PREF.get("twins.not", "[]") + "\u0002" +
      all.map(r => [r.space, r.path, r.block.id, r.title].join("\u0001")).join("\u0002");
    if (NEXT_TWINS_KEPT && NEXT_TWINS_KEPT.key === key) return NEXT_TWINS_KEPT.groups;
    const groups = projectTwinsOf(all);
    NEXT_TWINS_KEPT = {key, groups};
    return groups;
  });
}
