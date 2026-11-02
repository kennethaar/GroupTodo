/* People with open work who are not in the space -- the ones a sheet is for.
   A colleague who IS in the space does not need one: they can see the list. */
function outsidersOwingMe() {
  const by = new Map();
  for (const a of leafActions()) {
    if (!OPEN_STATES[a.state] || !a.assignee) continue;
    if (isMember(a.assignee) || samePerson(a.assignee, whoAmI())) continue;
    const k = slugPerson(a.assignee);
    if (!by.has(k)) by.set(k, {name: a.assignee, items: []});
    by.get(k).items.push(a);
  }
  return Array.from(by.values()).sort((x, y) => x.name.localeCompare(y.name));
}
