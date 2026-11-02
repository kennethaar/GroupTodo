/* ---------- changing a schedule ----------
   Out of every template that says when, except those for days gone by, which
   are the record of what was; into the ones the new schedule names; and the
   days already made from today on put right. Templates that say something
   else about the day -- a week, a quarter -- are left as they are. */
function setTrackerWhen(name, key, when) {
  const today = todayISO();
  const home = trackerWhen(name).space;
  for (const {sp, p} of trackerTemplatesWith(name)) {
    const n = baseName(p);
    if (!isWhenName(n) || isPastWhenName(n, today)) continue;
    inSpace(sp, () => dropTrackerLine(p, name));
  }
  return inSpace(home, () => {
    const names = when ? trackerTemplateNames(when, today) : [];
    for (const n of names) addTrackerLine(n, key);
    return Object.assign({names}, syncTrackerDays(name, key, new Set(names), {remove: true}));
  });
}
