function commitLine(txt, path, b) {
  let val = lineText(txt);
  if (val === b.title) return false;
  const before = b.title, wasTask = !!b.state;
  // A tracker's line is a key and its numbers; a name in it is not a person.
  if (!parseTracker(val)) val = linkKnownNames(val, before, namesFor(txt));
  if (!b.state) val = val.replace(ACTION_DOT_RE, "TODO ");
  const space = txt?.closest?.("[data-space]")?.dataset.space || V.space;
  const byVerb = !b.state && !splitState(val)[0] && verbTaskLine(path, val, before, space);
  if (byVerb) val = "TODO " + val;
  const [st, rest] = splitState(val);
  if (st) {
    const prev = b.state;
    b.state = st;
    b.title = rest;
    if (!prev) applyTodoTemplate(b);
    if (prev !== st) runTemplateRules(b, "status", st);
    stampAddedIfMissing(path, b);
  } else {
    b.title = val;
  }
  let who = null;
  if (b.state) {
    // @phone and #kitchen typed on a task, the way the capture box reads them.
    const marks = readMarks(b.title);
    if (marks.text !== b.title) b.title = linkKnownNames(trim(marks.text.replace(/\s{2,}/g, " ")));
    who = marks.who;
    const made = contextOf(b.title);
    if (made && !contextList().includes(made)) mergeLookalikeContext(made);
    const typed = dotsToEst(b.title);
    if (typed !== b.title) b.title = typed;
    else if (!estBand(b.title)) estHint();
  }
  if (b.state && OPEN_STATES[b.state] && !dueDate(b)) {
    /* The same reading the capture box gives a line -- "neste onsdag kl 13",
       "fri 2pm", "in 45 minutes" -- with the words to keep in the toast. */
    const w = parseWhen(b.title);
    if (w) offerKeepWords([{block: b, w, keys: applyWhen(b, w)}], path);
    if (dueDate(b)) warnDueConflict(path, b);
  }
  if (byVerb) notify("A to do: it starts with a verb.", "info", {label: "Keep as note", run: () => {
    setBlockState(path, b, null); render();
  }});
  dropUnlinkedAssignee(b, before);
  if (who) assignBlock(path, b, who);
  createLinkedPages(b.title);
  // A new task on a day page with no project above it asks for one (#401).
  askProjectIfNew(path, b, wasTask);
  // A new task straight on a project shows on today's Journal (#430).
  if (!wasTask) referInJournal(path, b);
  touch(path); noteTodoTouched();
  return true;
}
