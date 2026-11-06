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
  // Three core properties -- state, due, project -- plus two always-on
  // actions make up the line's own quick menu (`menu: true`). Every other
  // row here still exists, only to be opened directly: by its Alt+ key, or
  // as a leaf of the foot toolbar's Type/Tag/More groups (vars-EDIT_BAR.js),
  // which render on their own rather than inside this list.
  return [
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
    {k: "embedref", ic: FLY_EMBED, label: "Copy embed", key: "", menu: true, div: true},
    {k: "more", ic: FLY_PANEL, label: "Open side panel", key: "", menu: true},
  ];
}
