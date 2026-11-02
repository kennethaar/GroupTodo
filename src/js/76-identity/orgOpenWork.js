/* An organisation's open work: every open task that names it on its line,
   and whatever its people are carrying or are named in. */
function orgOpenWork(org) {
  const people = new Set(orgPeople(org).filter(p => trim(p)).map(slugPerson)), key = org.toLowerCase();
  return openWorkLinks().filter(({orgs, persons}) =>
    orgs.has(key) || [...persons].some(p => people.has(p))).map(x => x.a);
}
