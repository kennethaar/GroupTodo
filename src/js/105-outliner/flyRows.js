function flyRows() {
  const {path, block} = FLY;
  const t = block.state, waiting = t === "WAIT";
  const typed = taskStage(block);
  const who = assigneeOf(block);
  const proj = lineProject(path, block);
  const org = lineOrg(block);
  const people = acrossNames(() => [...allPeople().map(personName), ...members().map(m => m.name)])
    .filter(n => !(waiting && samePerson(n, whoAmI())));
  const onLine = linePeople(block);
  // The three core properties, then every action that is not a quick tag or
  // an entity change, sit together in the line's own quick menu
  // (`menu: true`) -- copy and move actions in one place, not split between
  // this menu and the foot toolbar. Context/Person/Organisation stay off it:
  // they are quick tags, reached by their Alt+ key or the foot toolbar's Tag
  // group (vars-EDIT_BAR.js) instead. Open side panel is left off too -- the
  // foot toolbar already has it as a direct button, so it needs no second
  // way in from here.
  const rows = [
    {k: "state", ic: FLY_STATE, label: typed ? "Stage" : "State", menu: true,
     val: typed && typed.stage ? typed.stage.name : t ? STATE_WORD[t] : "Note", key: "Ctrl+Enter",
     // A stage is told from a state by the mark in front of it.
     opts: typed ? [...typed.stages.map(s => ["\u0001" + s.name, s.name + " · " + CORE_WORD[s.core]]), ["", "Note"]]
                 : [["TODO", "To do"], ["DOING", "Doing"], ["WAIT", "Waiting"], ["DONE", "Done"], ["", "Note"]]},
    {k: "due", ic: FLY_DATE, label: "Due", val: dueDate(block) ? humanDate(dueDate(block)) : "None", key: "Alt+D", date: true, menu: true,
     opts: [[todayISO(), "Today"], [shiftISO(todayISO(), 1), "Tomorrow"], [nextWeekday(1), "Monday"],
            [shiftISO(todayISO(), 7), "In a week"], ["", "No date"]]},
    {k: "proj", ic: "#", label: "Project", val: proj ? proj.title : "None", key: "# · Alt+J", menu: !!proj,
     opts: [...["1", "3", "2"].flatMap(c => projectsIn(c)).map(p => [p, pageTitle(p)]), ["", "No project"]]},
    {k: "rep", ic: FLY_REPEAT, label: "Repeat", val: repeatOf(block) || "No", key: "Alt+R", menu: true,
     opts: [...REPEAT_CHOICES.map(c => [c, c || "No repeat"]), ["\u0002", "Custom…"]]},
    {k: "ctx", ic: "@", label: "Context", val: contextOf(block.title) ? "@" + contextOf(block.title) : blockContext(block) ? "@" + blockContext(block) + " (from above)" : "None", key: "@ · Alt+C",
     opts: [...ctxFolderOrder(allContextNames()).map(c => [c, contextLabel(c)]), ["", "No context"]]},
    {k: "who", ic: EB_PERSON, label: waiting ? "Waiting on" : "Person",
     val: waiting && (!who || samePerson(who, whoAmI())) ? "Pick someone" : who || "Me", key: "@ · Alt+P",
     opts: [...(waiting ? [] : [["", "Me"]]), ...people.filter(n => !samePerson(n, whoAmI())).map(n => [n, n])]},
    {k: "org", ic: EB_ORG, label: "Organisation", val: org || "None", key: "Alt+O",
     opts: [...allOrgNames().map(o => [o, o]), ["", "No organisation"]]},
    // One person on the line goes straight to the ask; several are picked from.
    ...(onLine.length ? [{k: "ask", ic: FLY_MAIL, label: "Ask for an update", val: onLine.join(", "), key: "Alt+E",
     opts: onLine.map(n => [n, n])}] : []),
    {k: "embedref", ic: FLY_EMBED, label: "Copy embed", key: "Alt+B", menu: true, div: true},
    {k: "plaincopy", ic: EB_COPY, label: "Copy text", key: "Alt+X", menu: true},
    {k: "refile", ic: FLY_REFILE, label: "Refile", key: "Alt+G", menu: true},
    {k: "trk", ic: FLY_TRACKER, label: "Insert tracker", key: "Alt+K", menu: true},
    {k: "aiplan", ic: FLY_PLAN, label: "Plan with AI", key: "Alt+A", menu: true},
  ];
  // Words selected in the line are the name: make it, or the names it likely means (#335).
  const sel = FLY.sel, open = sel && rows.find(r => r.k === FLY.open && TAG_SEL_PREFIX[r.k]);
  if (open) open.opts = tagSelOpts(open.opts, TAG_SEL_PREFIX[open.k], sel.text);
  return rows;
}
