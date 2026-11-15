/* ---------- the capture box ----------
   One line, from anywhere, onto today's page in the space new things land
   in. The same reading a line gets in the outline: names you have used are
   linked, @ is a context (or hands it to somebody, when no context is called
   that and a person is), # a project, and a date
   at the end is when it is due. Only a symbol is a command: a plain word is
   never read as a context, even one you have, and no word is cut out of the
   sentence -- "milk for the office" stays that (#315, P13). A pasted list is
   a list of tasks. */
function captureLine(raw) {
  let text = trim(raw);
  if (!text) return null;
  const path = ensureJournal(todayISO());
  const page = getPage(path);
  let who = null;
  /* "Call Bob fri 2pm", "Pay rent by the 1st every month", "until:eom": the
     day, the time, a deadline, a repeat -- the one reading the outline gives
     a line too (#396). */
  const w = parseWhen(text);
  if (w) text = w.title;
  const marks = readMarks(text);
  text = marks.text; who = marks.who;
  text = linkKnownNames(trim(text.replace(/\s{2,}/g, " ")));
  const made = contextOf(text);
  if (made && !contextList().includes(made)) mergeLookalikeContext(made);
  const blk = stampAuthor(newBlock({state: "TODO", title: text, props: {}}));
  const when = w ? [{block: blk, w, keys: applyWhen(blk, Object.assign({}, w, {title: text}))}] : [];
  createLinkedPages(blk.title);
  page.blocks.push(blk);
  touch(path);
  if (who) assignBlock(path, blk, who);
  noteTodoTouched();
  coachMark("add");
  return {path, block: blk, who, when};
}
