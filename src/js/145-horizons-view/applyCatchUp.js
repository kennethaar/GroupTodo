/* Make the catch-up changes as chosen (#516); Skip makes nothing. A next
   action goes on as Next (with its context), Do now (done, with its source to
   open), Delegate (a waiting-for on whom you gave it to) or Someday (a page of
   its own in Someday/Maybe). New lines go on before tasks are marked done, so
   a project is never left without a next action in between. A new to-do or
   project is captured, not clarified: a plain line on today's page, with its
   context, date, outcome and source, a new project's first next action under
   it, and noted so the review's Clarify takes it today. One Undo, on the
   toast or Ctrl+Z, puts every page back and takes away a page it made. */
function applyCatchUp(rows) {
  rows = rows.filter(r => r.choice !== "skip");
  if (!rows.length) return 0;
  const before = new Map(), made = [], captured = [], wasCaptured = PREF.get(CATCHUP_CAPTURED, "");
  const keep = p => { if (p && !before.has(p) && getPage(p)) before.set(p, structuredClone(getPage(p))); };
  const at = nowStamp(), me = whoAmI() || "Me";
  const source = url => "[" + catchUpLinkKind(url) + "](" + url + ")";
  const person = name => allPeople().map(personName).find(n => samePerson(n, name)) || name;
  const newProject = (title, code, blocks) => {
    if (code === "1") return createProjectPage(title, blocks);
    const path = join(STATUS_DIRS[code], slugify(title) + ".md");
    if (V.pages.has(path)) return path;
    const page = projectTemplateLines(slugify(title), code);
    if (blocks.length) page.blocks = blocks;
    putPage(path, page);
    return path;
  };
  const order = r => r.kind === "done" ? 1 : 0;
  for (const r of [...rows].sort((x, y) => order(x) - order(y))) {
    // Where it was found stays on what it changed or made, as source::.
    const mark = b => { if (b && r.url) setBlockProp(b, "source", source(r.url)); };
    if (r.kind === "next" && r.choice === "someday") {
      const path = newProject(r.text, "2", []);
      if (r.url) getPage(path).props.source = source(r.url);
      made.push(path);
      touch(path);
      continue;
    }
    if (r.kind === "todo" || r.kind === "project") {
      const fresh = !V.pages.has(journalPath(todayISO())), path = ensureJournal(todayISO());
      if (fresh) made.push(path); else keep(path);
      const title = linkKnownNames(r.text + (r.ctx ? " [[c/" + r.ctx + "]]" : ""));
      const b = stampAuthor(newBlock({title, props: {}}));
      if (r.date) setDue(b, r.date);
      if (r.outcome) setBlockProp(b, "outcome", r.outcome);
      mark(b);
      if (trim(r.next || "")) b.children = [stampAuthor(newBlock({title: linkKnownNames(trim(r.next)), props: {}}))];
      for (const x of [b, ...(b.children || [])]) { made.push(...createLinkedPages(x.title)); captured.push(clKey(path, x)); }
      getPage(path).blocks.push(b);
      stampAddedIfMissing(path, b);
      touch(path);
      continue;
    }
    keep(r.path);
    if (r.kind === "done") { setBlockState(r.path, r.block, "DONE"); mark(r.block); }
    else if (r.kind === "due") {
      if (r.choice === "start") setBlockProp(r.block, "SCHEDULED", whenValue(r.date));
      else setDue(r.block, r.date);
      mark(r.block);
    } else if (r.kind === "note" && r.block) mark(postMessageAs(r.path, r.block, r.text, me, at));
    else if (r.kind === "note") {
      // Progress with no task of its own: a note line on the project's page.
      const b = stampAuthor(newBlock({title: linkKnownNames(r.text), props: {}}));
      mark(b);
      getPage(r.path).blocks.push(b);
      stampAddedIfMissing(r.path, b);
    } else if (r.kind === "wait" && r.block) {
      // A task that someone else now does waits on them.
      const who = person(trim(r.who || ""));
      setBlockState(r.path, r.block, "WAIT");
      r.block.title = trim(r.block.title) + " from [[p/" + who + "]]";
      made.push(...createLinkedPages(r.block.title));
      if (r.date) setDue(r.block, r.date);
      mark(r.block);
    } else if (r.kind === "next" || r.kind === "wait") {
      keep(r.proj);
      const who = r.kind === "wait" || r.choice === "delegate" ? person(trim(r.who || "")) : "";
      const title = r.text + (r.kind === "next" && r.ctx ? " [[c/" + r.ctx + "]]" : "") + (who ? " from [[p/" + who + "]]" : "");
      const b = stampAuthor(newBlock({state: who ? "WAIT" : "TODO", title, props: {}}));
      if (r.date) setDue(b, r.date);
      mark(b);
      made.push(...createLinkedPages(title));
      getPage(r.proj).blocks.push(b);
      stampAddedIfMissing(r.proj, b);
      if (r.choice === "now") setBlockState(r.proj, b, "DONE");
      touch(r.proj);
    }
    touch(r.path);
  }
  if (captured.length) {
    const prev = catchUpCaptured();
    PREF.set(CATCHUP_CAPTURED, JSON.stringify({day: todayISO(), keys: [...prev, ...captured]}));
  }
  noteTodoTouched();
  const back = () => {
    for (const [p, snap] of before) { const pg = getPage(p); if (pg) { Object.assign(pg, structuredClone(snap)); touch(p); } }
    for (const p of made) if (getPage(p)) removePage(p);
    PREF.set(CATCHUP_CAPTURED, wasCaptured);
    render();
    return true;
  };
  pushUndo({run: back});
  if (rows.some(r => r.kind === "done" || r.choice === "now")) closeDoneToast();
  render();
  notify("Made " + (rows.length === 1 ? "1 change" : rows.length + " changes") + " from the catch-up.", "info",
    {label: "Undo", run: back});
  return rows.length;
}
