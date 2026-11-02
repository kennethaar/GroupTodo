function expiringTemplates(today = todayISO()) {
  const y = +today.slice(0, 4), mo = +today.slice(5, 7);
  const year = mo === 12 ? y : mo === 1 ? y - 1 : null;
  if (!year) return {year, items: []};
  const items = acrossSpaces(() => allPages(p => p.startsWith(DIRS.lists + "/")).flatMap(path => {
    const name = baseName(path), next = templateNextYearName(name, year);
    if (!next || V.pages.has(join(DIRS.lists, next + ".md"))) return [];
    // A day of a tracker's run is written ahead by topUpTrackerSeries, not copied a year on.
    if (isDateName(name) && onlyTrackers(getPage(path))) return [];
    return [{path, name, next, space: V.space}];
  }));
  return {year, items};
}
