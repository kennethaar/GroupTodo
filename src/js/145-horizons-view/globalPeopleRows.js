/* ---------- who the work is waiting on, in every space ----------
   Waiting-fors are spread over spaces the same way the people are: a client in
   the work space, a builder in the home one. Asking somebody for an update
   should not mean visiting each space to find out what they owe, so this list
   reads all of them. Spaces not loaded yet are loaded once, in the background,
   and the list fills in when they arrive. */
function globalPeopleRows() {
  const rows = [];
  const add = name => {
    if (!trim(name)) return null;
    let row = rows.find(r => samePerson(r.name, name));
    if (!row) { row = {name, items: [], spaces: new Set()}; rows.push(row); }
    return row;
  };
  for (const [space] of LOADED) inSpace(space, () => {
    for (const path of allPeople()) add(personName(path)).spaces.add(space);
    // Flattened, so each line knows the lines above it that may name the person.
    for (const [path, page] of V.pages) for (const b of flattenBlocks(page.blocks)) {
      if (b.state !== "WAIT") continue;
      const name = assigneeOf(b, page) || assigneeOf(b);
      const row = add(name);
      if (!row) continue;
      row.spaces.add(space);
      if (!samePerson(name, whoAmI()))
        row.items.push({path, block: b, title: b.title, state: b.state, assignee: name, space});
    }
  });
  return rows.sort((a, b) => a.name.localeCompare(b.name));
}
