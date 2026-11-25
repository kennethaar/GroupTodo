/* Make the ticked catch-up changes (#516). One Undo, on the toast or Ctrl+Z,
   puts every page back and takes away a project or person page it made. */
function applyCatchUp(rows) {
  rows = rows.filter(r => r.on);
  if (!rows.length) return 0;
  const before = new Map(), made = [];
  const keep = p => { if (p && !before.has(p) && getPage(p)) before.set(p, structuredClone(getPage(p))); };
  const at = nowStamp(), me = whoAmI() || "Me";
  const person = name => allPeople().map(personName).find(n => samePerson(n, name)) || name;
  for (const r of rows) {
    if (r.kind === "project") {
      const next = trim(r.next || "");
      const path = createProjectPage(r.text, next ? [stampAuthor(newBlock({state: "TODO", title: next, props: {}}))] : []);
      if (r.outcome) getPage(path).props.outcome = r.outcome;
      made.push(path);
      if (next) made.push(...createLinkedPages(next));
      touch(path);
      continue;
    }
    keep(r.path);
    if (r.kind === "done") setBlockState(r.path, r.block, "DONE");
    else if (r.kind === "due") setDue(r.block, r.date);
    else if (r.kind === "note") postMessageAs(r.path, r.block, r.text, me, at);
    else if (r.kind === "next" || r.kind === "wait") {
      keep(r.proj);
      const title = r.kind === "next" ? r.text : r.text + " from [[p/" + person(r.who) + "]]";
      const b = stampAuthor(newBlock({state: r.kind === "next" ? "TODO" : "WAIT", title, props: {}}));
      if (r.date) setDue(b, r.date);
      made.push(...createLinkedPages(title));
      getPage(r.proj).blocks.push(b);
      stampAddedIfMissing(r.proj, b);
      touch(r.proj);
    }
    touch(r.path);
  }
  noteTodoTouched();
  const back = () => {
    for (const [p, snap] of before) { const pg = getPage(p); if (pg) { Object.assign(pg, structuredClone(snap)); touch(p); } }
    for (const p of made) if (getPage(p)) removePage(p);
    render();
    return true;
  };
  pushUndo({run: back});
  if (rows.some(r => r.kind === "done")) closeDoneToast();
  render();
  notify("Made " + (rows.length === 1 ? "1 change" : rows.length + " changes") + " from the catch-up.", "info",
    {label: "Undo", run: back});
  return rows.length;
}
