function membersNow() {
  return allPeople().filter(isMemberPage).map(path => ({
    path, name: personName(path), me: samePerson(personName(path), whoAmI()),
  }));
}
