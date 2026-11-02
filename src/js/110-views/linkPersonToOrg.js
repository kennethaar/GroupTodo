/* ---------- people and organisations, onto each other ----------
   Each board has a tab for what its tray is dropped on. On People, the
   organisations: one card each, with whoever works there. On Organisations,
   the people: one card each, with where they work. A drop says the person
   works there -- organisation:: on their own page, which is where the "Works
   at" line on that page reads it and undoes it. Both put the most linked
   first: an organisation by its people and projects, a person by the open
   work that names them and where they work. */
function linkPersonToOrg(person, org) {
  if (personOrgs(person).some(o => o.toLowerCase() === org.toLowerCase())) {
    notify(personBareName(person) + " already works at " + org + "."); return;
  }
  const space = visibleSpaces().find(n => LOADED.has(n) && inSpace(n, () => V.pages.has(personPath(person)))) || V.space;
  const u = inSpace(space, () => {
    createLinkedPages("[[p/" + person + "]]");
    return pageLinkPropAdd(personPath(person), "organisation", "o/" + org);
  });
  if (u) pushUndo({run: () => { inSpace(space, u); render(); return true; }});
  const many = !isCircleOrg(org) && manyOrgsWarning(person);
  notify(personBareName(person) + (isCircleOrg(org) ? " is in " : " works at ") + org + ". " +
    (many ? many + " " : "") + "Ctrl-Z takes it back.", many ? "warn" : undefined);
  render();
}
