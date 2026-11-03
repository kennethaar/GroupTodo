function leafActionsHere() {
  const out = [];
  /* Everywhere a task you can still do is written: the active and waiting
     projects, every day page (not just the recent ones -- an old task is the
     one you most need to see), and the loose pages, so a TODO typed on a
     person or a note is not invisible to every list in the app. Completed,
     cancelled and someday/maybe projects stay out: that is what filing a
     project there means. */
  const paths = [...projectsIn("1"), ...projectsIn("3"), ...allJournals(), ...looseTodoPages()];
  for (const path of paths) {
    const page = getPage(path); if (!page || isArchived(path)) continue;
    const journal = isJournalPath(path);
    const statusDir = statusDirOf(path);
    const flat = flattenBlocks(page.blocks);
    for (const b of flat) {
      if (!OPEN_STATES[b.state] || hasOpenDescendant(b)) continue;
      // A line in a conversation is somebody talking, not a task of yours.
      if (isMessage(b)) continue;
      const linked = journal ? nearestProjectAncestor(b) : null;
      const fromList = journal && !linked ? nearestChecklistAncestor(b) : null;
      let group = "JOURNAL", project = null, projectStatusDir = null, projectPath = null;
      if (!journal && !statusDir) {
        // A page that is not a project: it is still where the task lives, so
        // it groups under its own name wherever tasks group by project.
        group = b.state === "WAIT" ? "WAITING" : "PAGE";
        project = pageTitle(path);
        projectPath = path;
      } else if (!journal) {
        group = b.state === "WAIT" ? "WAITING" : "PROJECT";
        project = pageTitle(path);
        projectStatusDir = statusDirOf(path);
        projectPath = path;
      } else if (linked) {
        group = b.state === "WAIT" ? "WAITING" : "LINKED";
        project = linked.title;
        projectStatusDir = linked.statusDir;
        projectPath = findExistingPage(linked.ref);
      } else if (fromList) {
        group = b.state === "WAIT" ? "WAITING" : "CHECKLIST";
      } else if (b.state === "WAIT") {
        group = "WAITING";
      }
      // Handed to somebody else: the same row, seen from your side. No copy is
      // made, so ticking it off once is enough for both of you. A task nobody
      // handed anywhere belongs to whoever wrote it: on a project page that is
      // anyone in the space, on a day page it is the person whose day it is.
      const assignee = assigneeOf(b, page);
      const owner = journalOwnerOf(path) || null;
      const mine = assignee ? samePerson(assignee, whoAmI())
                 : !(journal && owner && owner !== journalOwner());
      // The household's is still a task here: somebody in the house ticks it off.
      if (!mine && assignee && !isHousehold(assignee)) group = "WAITING";

      // An undated step answers to its parent's date: it is what is due now.
      const due = effectiveDue(b);
      if (due) {
        if (due < todayISO()) group = "LATE";
        else if (due === todayISO()) group = "TODAY";
      }
      /* A step of the tour is a door, not a next action: telling somebody on
         their first morning that "Find everything you have open" lacks a
         context is the method talking to itself. */
      const tourStep = !!tourDestOf(b.title);
      /* The same applies to the wording nudges: a step was phrased once, in the
         list, and asking for a verb again on every run is the method talking to
         itself. Fix the list, not the copy. */
      const authored = tourStep || !!fromList;
      const ph = projectPath ? projectHold(projectPath) : null;
      const own = holdOf(b);
      const hold = own && ph ? (own > ph ? own : ph) : own || ph;
      out.push({
        path, block: b, state: b.state, title: b.title,
        project, projectPath, projectStatusDir, group, due,
        held: hold && hold > todayISO() ? hold : null,
        assignee, mine, owner: journalOwnerOf(path) || null,
        tourStep, checklist: fromList ? fromList.title : null,
        area: journal && !linked ? (nearestAreaAncestor(b) || {}).title || null : null,
        context: blockContext(b),
        missingContext: !authored && !blockContext(b),
        missingVerb: !authored && !startsWithVerb(b.title),
        // Journal items carry no Added:: stamp (the filename is the date),
        // so fall back to the journal's own date to keep "oldest first" honest.
        by: blockProp(b, "by"), doneBy: blockProp(b, "done_by"),
        added: addedDate(b) || (journal ? journalDate(path) : null),
        age: blockAge(b) ?? (journal ? dateDiffDays(journalDate(path), todayISO()) : null),
      });
    }
  }
  return out;
}
