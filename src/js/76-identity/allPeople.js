function allPeople() {
  return allPages(p => p.startsWith(DIRS.people + "/")).sort((a, b) =>
    personName(a).localeCompare(personName(b)));
}
