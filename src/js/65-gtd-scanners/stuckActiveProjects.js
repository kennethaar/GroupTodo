/* Active projects with nothing actionable left -- the classic GTD trap. */
function stuckActiveProjects() {
  /* A task on a day page that links the project moves it along just as one
     written on the project page does, whatever group it lands in: waiting,
     handed to somebody, or due today all still count. */
  const linkedFromJournal = new Set();
  for (const a of leafActions()) {
    if (a.project && isJournalPath(a.path)) linkedFromJournal.add(a.project.toLowerCase());
  }
  const stuck = [];
  for (const path of projectsIn("1")) {
    if (projectHold(path)) continue;          // nobody is meant to be doing it yet
    if (isStandIn(path)) continue;            // its file is not in yet
    const page = getPage(path);
    const flat = flattenBlocks(page.blocks);
    let leafTodo = false, waiting = false, parentTodos = false;
    for (const b of flat) {
      if (b.state === "TODO" || b.state === "DOING") {
        if (hasOpenDescendant(b)) parentTodos = true; else leafTodo = true;
      } else if (b.state === "WAIT" && !hasOpenDescendant(b)) waiting = true;
    }
    const fromJournal = linkedFromJournal.has(pageTitle(path).toLowerCase())
                     || linkedFromJournal.has(baseName(path).toLowerCase());
    if (!leafTodo && !waiting && !fromJournal) {
      stuck.push({path, reason: parentTodos ? "Has parent TODOs but no actionable task" : "No next action"});
    }
  }
  return stuck;
}
