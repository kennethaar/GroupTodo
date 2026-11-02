// [{space, path, name, iso, days, age}] within the next `within` days, soonest first.
function upcomingBirthdays(within) {
  const seen = new Set(), out = [];
  for (const space of visibleSpaces()) {
    if (!LOADED.has(space)) continue;
    inSpace(space, () => {
      for (const path of allPeople()) {
        const b = parseBirthday(birthdayIn(getPage(path)?.props));
        const key = slugPerson(personName(path));
        if (!b || seen.has(key)) continue;
        seen.add(key);
        const n = nextBirthday(b);
        if (n.days <= within) out.push({space, path, name: personName(path), ...n});
      }
    });
  }
  return out.sort((x, y) => x.days - y.days || x.name.localeCompare(y.name));
}
