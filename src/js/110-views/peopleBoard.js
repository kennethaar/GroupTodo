/* One tray of names, and a tab for what they are dropped on: a project to
   involve them, an organisation they work at, another area to move, copy or
   sync them into, or a next action to hand over. */
function peopleBoard(people) {
  const busy = byLinks(personLinks, p => p.name);
  const item = p => ({name: p.name, face: avatarNode(p.name, 22),
    sub: p.me ? "you" : p.open.length ? p.open.length + " open" : ""});
  const them = people.filter(p => !p.me);
  const tabsFor = [["projects", "Projects"], ["orgs", "Organisations"],
    ...(Spaces.list.length > 1 ? [["areas", "Areas"]] : []), ["tasks", "Tasks"]];
  const pref = PREF.get("people.board.onto", "projects");
  const onto = tabsFor.some(([v]) => v === pref) ? pref : "projects";
  const say = {projects: "Drag a name onto a project to involve them.",
    orgs: "Drag a name onto the organisation they work at.",
    areas: "Drag a name onto an area to move, copy or sync the person there.",
    tasks: "Drag a name onto a next action to hand it over. It lands in your Waiting for; drop yourself on it to take it back."}[onto];
  /* Placing people at organisations is mostly placing the ones nobody has yet,
     so on that tab whoever already works somewhere is out of the tray until
     asked for -- the chip says how many that is. */
  const hidePlaced = onto === "orgs" && placedHidden();
  const unplaced = p => !hidePlaced || !personOrgs(p.name).length;
  const placed = onto === "orgs" ? people.filter(p => personOrgs(p.name).length).length : 0;
  const picker = trayPicker("person", say + " Or click a name, then click the target.",
    [["", people.filter(p => p.me && unplaced(p)).map(item)],
     ["In the area", them.filter(p => p.member && unplaced(p)).sort(busy).map(item)],
     ["Others", them.filter(p => !p.member && unplaced(p)).sort(busy).map(item)]], "Find a person");
  const tabs = ontoTabs("Drag a person to:", "people.board.onto", onto, tabsFor);
  const board = right => el("div", {}, tabs, el("div", {class: "assign"}, picker, right),
    el("p", {class: "hint"}, "Esc puts a picked-up name down."));
  const grid = (cards, empty) => cards.length ? el("div", {class: "pcards"}, ...cards) : emptyCard(empty);

  if (onto === "orgs") return board(assignTargets([grid(orgDropCards(),
    "No organisations yet. Write [[o/Name]] on any line to make one.")], [placedChip(placed)], "Find an organisation"));

  if (onto === "areas") {
    const cards = Spaces.list.map(sp => {
      const n = LOADED.has(sp.name) ? inSpace(sp.name, () => allPeople().length) : null;
      const card = el("div", {class: "pcard", data: {q: sp.name.toLowerCase()}},
        el("h4", {}, el("span", {class: "btab-dot", style: "background:" + spaceColor(sp.name) + ";display:inline-block;margin-right:6px"}), sp.name),
        el("div", {class: "t-meta"}, n == null ? null : el("span", {class: "chip"}, n + (n === 1 ? " person" : " people"))),
        el("div", {class: "stakes"}, el("span", {class: "say"}, "Drop a person here to move, copy or sync them into " + sp.name + ".")));
      return trayTarget(card, d => d.kind === "person" && !samePerson(d.name, whoAmI()),
        d => { TRAY_ARMED = null; document.body.classList.remove("armed-on");
               carryPerson(d.name, sp.name).then(ok => { if (ok) render(); }); });
    });
    return board(assignTargets([grid(cards, "Only one area.")], [], "Find an area"));
  }

  const all = workingProjects();
  const {keep, sel} = areaFilter(all, "people.board.area");
  const hideEmpty = String(PREF.get("people.board.hideEmpty", "1")) === "1";
  /* A task that names an organisation on its line and nobody to do it is the
     organisation's work: it wears the organisation's dot here, and can be left
     to the Organisations page altogether. One handed to a person stays. */
  const hideOrgs = String(PREF.get("people.board.hideOrgs", "0")) === "1";
  const orgOnly = a => !a.assignee && !!lineOrg(a.block);
  const rows = all.filter(keep).map(r => ({r, title: rowTitle(r),
    open: openOf(projectActions(r)).filter(a => !hideOrgs || !orgOnly(a))}));
  const shown = rows.filter(x => onto === "tasks" ? (!hideEmpty || x.open.length)
      : (!hideEmpty || x.open.length || projectPeople(x.r).length))
    .sort((a, b) => (b.open.length - a.open.length) || a.title.localeCompare(b.title));
  const hidden = rows.length - shown.length;
  const toggle = fchip(hidden ? "Hide empty (" + hidden + ")" : "Hide empty", hideEmpty,
    () => { PREF.set("people.board.hideEmpty", hideEmpty ? "0" : "1"); render(); });
  const peopleOn = r => projectPeople(r).map(n => stake(n, avatarNode(n, 18),
    () => removeLinkFromProp(r.space, r.path, "with", "p/" + n)));

  if (onto === "tasks") {
    const cards = shown.map(({r, title, open}) => {
      const acts = el("div", {class: "pacts"});
      for (const a of open) {
        const org = lineOrg(a.block);
        const row = el("div", {class: "pact", title: plainTitle(a.title) +
            (a.assignee ? " - " + a.assignee : org ? " - for " + org + ", nobody on it yet" : " - yours")},
          a.assignee ? avatarNode(a.assignee, 20) : org ? el("span", {class: "odot sm", style: "width:20px;height:20px"}, org[0])
            : el("span", {class: "nobody"}), el("span", {class: "pt"}, plainTitle(a.title)));
        trayTarget(row, d => d.kind === "person", d => {
          if (samePerson(d.name, a.assignee || whoAmI()) && (a.assignee || samePerson(d.name, whoAmI()))) return;
          inSpace(a.space, () => assignBlock(a.path, a.block, samePerson(d.name, whoAmI()) ? "" : d.name));
        });
        acts.append(row);
      }
      if (!open.length) acts.append(el("div", {class: "say", style: "font-size:12px;padding:2px 4px"}, "No next actions"));
      return projectCard(r, title, [], acts, open.map(a => plainTitle(a.title)));
    });
    const orgToggle = fchip("Hide organisation tasks", hideOrgs,
      () => { PREF.set("people.board.hideOrgs", hideOrgs ? "0" : "1"); render(); });
    return board(assignTargets([grid(cards, "No next actions to show.")], [sel, toggle, orgToggle], "Find a task or project"));
  }

  const cards = shown.map(({r, title}) => trayTarget(projectCard(r, title, peopleOn(r)), d => d.kind === "person", d => {
    if (samePerson(d.name, whoAmI())) { notify("You are on every project you can see."); return; }
    if (inSpace(r.space, () => pageLinkPropAdd(r.path, "with", "p/" + d.name))) notify(d.name + " is now involved in " + title + ".");
    else notify(d.name + " is already on " + title + ".");
    render();
  }));
  return board(assignTargets([grid(cards, "No projects to show.")], [sel, toggle], "Find a project"));
}
