function commitLine(txt, path, b) {
  let val = lineText(txt);
  if (val === b.title) return false;
  const before = b.title;
  // A tracker's line is a key and its numbers; a name in it is not a person.
  if (!parseTracker(val)) val = linkKnownNames(val, before, namesFor(txt));
  if (!b.state) val = val.replace(ACTION_DOT_RE, "TODO ");
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
  if (b.state) {
    const typed = dotsToEst(b.title);
    if (typed !== b.title) b.title = typed;
    else if (!estBand(b.title)) estHint();
  }
  if (b.state && OPEN_STATES[b.state] && !dueDate(b)) {
    /* The same reading the capture box gives a line -- "neste onsdag kl 13",
       "fri 2pm", "in 45 minutes" -- with the words to keep in the toast.
       Failing that, the plain date at the end. */
    const w = parseWhen(b.title);
    if (w) offerKeepWords([{block: b, w, keys: applyWhen(b, w)}], path);
    else {
      const d = trailingDate(b.title);
      if (d) { b.title = trim(b.title.slice(0, d.start)); setDue(b, d.iso); }
    }
    if (dueDate(b)) warnDueConflict(path, b);
  }
  dropUnlinkedAssignee(b, before);
  createLinkedPages(b.title);
  touch(path); noteTodoTouched();
  return true;
}
