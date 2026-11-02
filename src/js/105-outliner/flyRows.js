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
  return [
    {k: "kind", ic: t ? "•" : "☐", label: t ? "Make it a note" : "Make it a task", key: "Alt+T"},
    {k: "mkproj", ic: ICON.projects, label: "Make it a project", key: "Alt+1"},
    {k: "mkzet", ic: "◇", label: "Turn into zettel", val: "a note of its own", key: "Alt+Z"},
    {k: "mkarea", ic: "◎", label: statusDirOf(path) && !isJournalPath(path) ? "Turn the project into a responsibility" : "Make it a responsibility",
     val: "new, or one already there", key: "Alt+I"},
    {k: "state", ic: "◐", label: typed ? "Stage" : "State",
     val: typed && typed.stage ? typed.stage.name : t ? STATE_WORD[t] : "Note", key: "Ctrl+Enter",
     // A stage is told from a state by the mark in front of it.
     opts: typed ? [...typed.stages.map(s => ["\u0001" + s.name, s.name + " · " + CORE_WORD[s.core]]), ["", "Note"]]
                 : [["TODO", "To do"], ["DOING", "Doing"], ["WAIT", "Waiting"], ["DONE", "Done"], ["", "Note"]]},
    {k: "ttype", ic: "☰", label: "Type", val: typed ? pageTitle(typed.list) : "stages of its own", key: ""},
    {k: "due", ic: "📅", label: "Due", val: dueDate(block) ? humanDate(dueDate(block)) : "None", key: "Alt+D", date: true,
     opts: [[todayISO(), "Today"], [shiftISO(todayISO(), 1), "Tomorrow"], [nextWeekday(1), "Monday"],
            [shiftISO(todayISO(), 7), "In a week"], ["", "No date"]]},
    {k: "ctx", ic: "@", label: "Context", val: contextOf(block.title) ? "@" + contextOf(block.title) : blockContext(block) ? "@" + blockContext(block) + " (from above)" : "None", key: "@ · Alt+C",
     opts: [...ctxFolderOrder(allContextNames()).map(c => [c, contextLabel(c)]), ["", "No context"]]},
    {k: "who", ic: ICON.people, label: waiting ? "Waiting on" : "Person",
     val: waiting && (!who || samePerson(who, whoAmI())) ? "Pick someone" : who || "Me", key: "@ · Alt+P",
     opts: [...(waiting ? [] : [["", "Me"]]), ...people.filter(n => !samePerson(n, whoAmI())).map(n => [n, n])]},
    // One person on the line goes straight to the ask; several are picked from.
    ...(onLine.length ? [{k: "ask", ic: "✉", label: "Ask for an update", val: onLine.join(", "), key: "Alt+E",
     opts: onLine.map(n => [n, n])}] : []),
    {k: "tell", ic: "✉", label: "Send an update", val: onLine.length ? onLine.join(", ") : "tell somebody where it stands", key: "Alt+U"},
    {k: "org", ic: ICON.orgs, label: "Organisation", val: org || "None", key: "Alt+O",
     opts: [...allOrgNames().map(o => [o, o]), ["", "No organisation"]]},
    {k: "proj", ic: "#", label: "Project", val: proj ? proj.title : "None", key: "# · Alt+J",
     opts: [...["1", "3", "2"].flatMap(c => projectsIn(c)).map(p => [p, pageTitle(p)]), ["", "No project"]]},
    {k: "rep", ic: "↻", label: "Repeat", val: repeatOf(block) || "No", key: "Alt+R",
     opts: [...REPEAT_CHOICES.map(c => [c, c || "No repeat"]), ["\u0002", "Custom\u2026"]]},
    {k: "meet", ic: "👥", label: isMeeting(block) ? "Meeting" : "Make it a meeting",
     val: isMeeting(block) ? blockProp(block, "time") || "attendees, agenda" : "attendees, agenda", key: "Alt+M"},
    {k: "trk", ic: "↗", label: "Insert tracker", val: "something to follow over time", key: "tracker-"},
    {k: "refile", ic: "↦", label: "Refile", val: "to a project, responsibility or context", key: "Alt+G"},
    {k: "aiplan", ic: "✦", label: "Plan it with an AI", val: "a prompt for your AI; its answer becomes a project", key: ""},
    {k: "embedref", ic: "⧉", label: "Copy as embed", val: "paste it on another line to show this one there", key: ""},
    {k: "more", ic: "⤢", label: "Open in the side panel", val: "dates, chat, history", key: ""},
  ];
}
