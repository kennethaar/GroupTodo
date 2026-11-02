/* Each open action with the organisations it names and the people it is about,
   worked out once per render: Organisations asks this once per organisation. */
function openWorkLinks() {
  return memo("openWorkLinks", () => openOf(leafActions()).map(a => {
    const links = linksIn(a.block?.title || a.title || "").map(l => trim(l.split("][")[0]));
    const orgs = new Set(links.filter(l => l.startsWith("o/")).map(l => l.slice(2).toLowerCase()));
    const persons = new Set(links.filter(l => l.startsWith("p/") && trim(l.slice(2))).map(l => slugPerson(l.slice(2))));
    const who = a.assignee || a.owner;
    if (trim(who)) persons.add(slugPerson(who));
    return {a, orgs, persons};
  }));
}
