/* Active projects with nothing actionable left -- the classic GTD trap. */
function stuckActiveProjects() {
  /* A task on a day page that links the project moves it along just as one
     written on the project page does, whatever group it lands in: waiting,
     handed to somebody, or due today all still count. */
  const linkedFromJournal = new Set();
  for (const a of leafActions()) {
    if (a.project && isJournalPath(a.path)) linkedFromJournal.add(a.project.toLowerCase());
  }
  /* A meeting on a day page that links the project, in its own words or a
     line above it, is what moves the project until its day has passed. Then
     the notes want processing (#385). Cancelled ones do not count. */
  const meetSoon = new Set(), meetHeld = new Set(), today = todayISO();
  for (const [jp, jpage] of V.pages) {
    if (!isJournalPath(jp)) continue;
    const day = dateIn(baseName(jp));
    if (!day) continue;
    for (const b of flattenBlocks(jpage.blocks)) {
      if (!isMeeting(b) || /^#meeting Cancelled:/i.test(b.title) || b.state === "CANCELLED") continue;
      for (let x = b; x; x = x._parent)
        for (const ref of linksIn(x.title)) {
          // An attendee is a person, even one whose page is not there yet.
          if (resolveWikiPath(trim(ref.split("|")[0])).startsWith(DIRS.people + "/")) continue;
          const to = findExistingPage(ref);
          if (to) (day >= today ? meetSoon : meetHeld).add(to);
        }
    }
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
    if (!leafTodo && !waiting && !fromJournal && !meetSoon.has(path)) {
      stuck.push({path, reason: parentTodos ? "Has parent TODOs but no actionable task"
        : meetHeld.has(path) ? "Meeting held - process the notes" : "No next action"});
    }
  }
  return stuck;
}
