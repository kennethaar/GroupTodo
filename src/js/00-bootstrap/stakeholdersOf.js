/* Who to tell a project is finished: the people it is with:: (you aside) and
   its clients, each with the address on their page, or "" when there is none. */
function stakeholdersOf(space, path) {
  if (space && space !== V.space && !LOADED.has(space)) return [];
  return inSpace(space, () => {
    if (!getPage(path)) return [];
    const r = {space, path}, me = (whoAmI() || "").toLowerCase();
    const out = [
      ...projectPeople(r).filter(n => n.toLowerCase() !== me).map(name => ({name, email: emailOf(name, space)})),
      ...projectClients(r).map(name => ({name, org: true, email: orgProp(name, EMAIL_PROP)})),
    ];
    // And whoever follows the responsibility it is under.
    const area = areaOfProject(path);
    for (const s of area ? stakeholdersOfArea(areaPathOf(area)) : [])
      if (!out.some(x => sameStake(x, s)) && !(!s.org && s.name.toLowerCase() === me))
        out.push({name: s.name, org: s.org, email: s.org ? orgProp(s.name, EMAIL_PROP) : emailOf(s.name, space)});
    return out;
  });
}
