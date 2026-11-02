/* Who is due to hear: every stakeholder whose rhythm has passed on a
   responsibility with something under it, by person: [{name, org, areas}]. */
function stakeholdersDue() {
  return memo("stakeholdersDue", () => {
    const by = [];
    for (const a of acrossSpaces(() => areaList().map(path => ({path})))) {
      const space = a.space || V.space;
      if (!inSpace(space, () => projectsInArea(baseName(a.path)).some(p => ["1", "3"].includes(statusDirOf(p))))) continue;
      for (const s of inSpace(space, () => stakeholdersOfArea(a.path))) {
        const every = updateEveryDays(s);
        if (every == null) continue;
        const told = inSpace(space, () => toldOn(a.path, s));
        const days = told ? dateDiffDays(told, todayISO()) : null;
        if (days != null && days < every) continue;
        let row = by.find(x => sameStake(x, s));
        if (!row) by.push(row = {name: s.name, org: s.org, areas: []});
        row.areas.push({title: inSpace(space, () => pageTitle(a.path)), days});
      }
    }
    return by;
  });
}
