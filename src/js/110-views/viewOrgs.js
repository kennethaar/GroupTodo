/* ============================================================
   ORGANISATIONS -- whose work it is
   ============================================================ */
function viewOrgs() {
  const sub = subNow();
  const c = el("div", {class: "wrap" + (sub === "board" ? " wide" : " lwide")});
  c.append(vhead("Organisations", "Whose work it is",
    newBtn("organisation", () => pickName({title: "Organisation", items: [], prefix: "o",
      onPick: n => { followLink("o/" + n); }})), viewSeg("orgs")));
  const orgs = dirPagesInVisible("org");
  const projectsOf = name => workingProjects().filter(r => projectOrgs(r).some(o => o.toLowerCase() === name.toLowerCase()));
  if (sub === "board") { c.append(orgBoard(orgs, projectsOf)); return c; }
  /* Its work is its projects' next actions, every open task that names it on
     the line itself -- [[o/Acme]] on a task is as much Acme's as org:: on a
     project -- and what its people are carrying or named in. */
  const rows = orgs.map(o => {
    const name = inSpace(o.space, () => pageTitle(o.path));
    const ps = projectsOf(name);
    const open = [...new Map([...ps.flatMap(r => openOf(projectActions(r))),
      ...orgOpenWork(baseName(o.path))].map(a => [a.block || a, a])).values()];
    return {o, name, what: pageProp(o.space, o.path, "what"), ps, open};
  }).sort((a, b) => a.name.localeCompare(b.name));
  const f = textFilter("orgs", "Filter organisations", rows, x => [x.name, x.what].join(" "), (hits, q) =>
    pagedCard(hits, orgRow, noMatch(q, "No organisations yet. A client, an employer or a club is a page under o/ - write [[o/Name]] on any line.")));
  c.append(fbar(f.input), f.host);
  c.append(el("p", {class: "hint"}, "Open one to see its projects. Use the board to add organisations to projects by dragging."));
  return c;
}
