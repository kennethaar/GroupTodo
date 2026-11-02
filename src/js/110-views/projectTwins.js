// Groups of look-alike projects: [{rows: [{space, path, title, code}], why}].
function projectTwins() {
  return memo("projectTwins", () => {
    const all = STATUS_ORDER.flatMap(code => visibleProjects(code).map(r => ({...r, code, title: rowTitle(r)})))
      .filter(r => !inSpace(r.space, () => isTourProject(r.path)));
    const key = PREF.get("twins.not", "[]") + "\u0002" + all.map(r => [r.space, r.path, r.code, r.title].join("\u0001")).join("\u0002");
    if (TWINS_KEPT && TWINS_KEPT.key === key) return TWINS_KEPT.groups;
    const groups = projectTwinsOf(all);
    TWINS_KEPT = {key, groups};
    return groups;
  });
}
