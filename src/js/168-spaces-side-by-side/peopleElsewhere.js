// People the other loaded areas have a page for and this one does not.
function peopleElsewhere(space, here = null) {
  const have = new Set((here || inSpace(space, () => allPeople().map(personName))).map(n => n.toLowerCase()));
  const out = [];
  for (const sp of LOADED.keys()) {
    if (sp === space) continue;
    for (const name of inSpace(sp, () => allPeople().map(personName))) {
      if (have.has(name.toLowerCase()) || samePerson(name, whoAmI())) continue;
      have.add(name.toLowerCase());
      out.push({name, space: sp});
    }
  }
  return out;
}
