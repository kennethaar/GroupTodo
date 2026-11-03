function household() {
  return memo("household\u0000" + (V.space || ""), () => allPeople().filter(isHouseholdPage).map(path => ({
    path, name: personName(path), me: false, household: true})));
}
