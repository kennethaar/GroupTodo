function respSummary(area, to) {
  return inSpace(area.space, () => projectsInArea(baseName(area.path))
    .filter(p => !isArchived(p))
    .filter(p => {
      const code = statusDirOf(p);
      if (code === "1" || code === "3") return true;
      if (code !== "0" && code !== "-") return false;
      const done = dateIn(String(getPage(p)?.props?.completed || "")) || "";
      return done >= area.since;
    })
    .map(p => projectSummary(area.space, p, area.since)));
}
