/* Make the catch-up changes as chosen (#516); Skip makes nothing. New lines go
   on before tasks are marked done, so a project is never left without a next
   action in between. A new line (next action, to-do, project, a project's
   progress) is captured, not clarified: a plain line on today's page, under
   one heading marked as the AI's (by:: AI), with its context, date, outcome,
   source and a link to its project, a new project's first next action under
   it, and noted so Clarify takes it today. Then the mini review of those
   lines starts (cuRunStart, #516 follow-up). One Undo, on the toast or
   Ctrl+Z, puts every page back and takes away a page it made. */
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
  // The heading the AI's lines go under, made with the first of them.
  let head = null, day = null;
  const lines = [];
  for (const r of [...rows].sort((x, y) => order(x) - order(y))) {
    // Where it was found stays on what it changed or made, as source::.
    const mark = b => { if (b && r.url) setBlockProp(b, "source", source(r.url)); };
    if (r.kind === "todo" || r.kind === "project" || r.kind === "next" || (r.kind === "note" && !r.block)) {
      const fresh = !V.pages.has(journalPath(todayISO())), path = ensureJournal(todayISO());
      if (fresh) made.push(path); else keep(path);
      if (!head) {
        const time = new Date().toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
        head = newBlock({title: CU_MARK + " Catch-up from AI · " + time, props: {by: "AI"}});
        getPage(path).blocks.push(head);
        day = path;
      }
      // Its project, linked, so the line is part of it wherever it is listed.
      const proj = r.proj && getPage(r.proj) ? "[[" + pageTitle(r.proj) + "]]" : "";
      const words = linkKnownNames(r.text + (r.ctx ? " [[c/" + r.ctx + "]]" : ""));
      const title = proj && !words.includes(proj) ? words + " " + proj : words;
      const b = stampAuthor(newBlock({title, props: {}}));
      if (r.date) setDue(b, r.date);
      if (r.outcome) setBlockProp(b, "outcome", r.outcome);
      mark(b);
      if (trim(r.next || "")) b.children = [stampAuthor(newBlock({title: linkKnownNames(trim(r.next)), props: {}}))];
      for (const x of [b, ...(b.children || [])]) { made.push(...createLinkedPages(x.title)); captured.push(clKey(path, x)); }
      head.children.push(b);
      lines.push(b, ...(b.children || []));
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
    else if (r.kind === "wait" && r.block) {
      // A task that someone else now does waits on them.
      const who = person(trim(r.who || ""));
      setBlockState(r.path, r.block, "WAIT");
      r.block.title = trim(r.block.title) + " from [[p/" + who + "]]";
      made.push(...createLinkedPages(r.block.title));
      if (r.date) setDue(r.block, r.date);
      mark(r.block);
    } else if (r.kind === "wait") {
      // A new waiting-for on a project.
      keep(r.proj);
      const who = person(trim(r.who || ""));
      const title = r.text + " from [[p/" + who + "]]";
      const b = stampAuthor(newBlock({state: "WAIT", title, props: {}}));
      if (r.date) setDue(b, r.date);
      mark(b);
      made.push(...createLinkedPages(title));
      getPage(r.proj).blocks.push(b);
      stampAddedIfMissing(r.proj, b);
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
    CU_RUN = null;
    render();
    return true;
  };
  pushUndo({run: back});
  if (rows.some(r => r.kind === "done")) closeDoneToast();
  if (lines.length) cuRunStart(day, lines);
  else render();
  notify("Made " + (rows.length === 1 ? "1 change" : rows.length + " changes") + " from the catch-up.", "info",
    {label: "Undo", run: back});
  return rows.length;
}
