/* ---------- the capture box ----------
   One line, from anywhere, onto today's page in the space new things land
   in. The same reading a line gets in the outline: names you have used are
   linked, @ is a context (or hands it to somebody, when no context is called
   that and a person is), # a project, and a date
   at the end is when it is due. A context you already have, as the last word
   before the date, is where it can be done -- "Call Mia about the VAT phone
   tomorrow" -- and so is @phone when nobody is called that. A pasted list is
   a list of tasks. */
function captureLine(raw) {
  let text = trim(raw);
  if (!text) return null;
  const path = ensureJournal(todayISO());
  const page = getPage(path);
  let who = null, due = null;
  /* "Call Bob fri 2pm", "Pay rent by the 1st every month", "until:eom": the
     day, the time, a deadline, a repeat. Failing that, the plain date at the
     end that the outline also understands -- "this weekend", "end of week". */
  const w = parseWhen(text);
  if (w) text = w.title;
  const tail = w ? null : trailingDate(text);
  if (tail) { due = tail.iso; text = trim(text.slice(0, tail.start)); }
  // @phone, #rollup and @mia, typed out rather than picked from the list.
  // @@phone still means the context, the way it was written before @ did.
  text = text.replace(/(^|\s)@@([\p{L}\p{N}_-]+(?:\/[\p{L}\p{N}_-]+)*)/gu, (m, sp, c) => sp + "[[c/" + ctxSlug(c) + "]]");
  /* Only the last word, so "Buy a phone charger" is still about a phone. A
     room's own name finds it in its folder: kitchen is home/kitchen when
     that is the only kitchen. */
  const known = w => {
    const all = contextList(), lw = w.toLowerCase();
    const exact = all.find(c => c.toLowerCase() === lw) || contextByAlias(lw);
    if (exact || lw.includes("/")) return exact;
    const inFolder = all.filter(c => c.toLowerCase().endsWith("/" + lw));
    return inFolder.length === 1 ? inFolder[0] : undefined;
  };
  if (!contextOf(text)) {
    const last = /(^|\s)([\p{L}\p{N}_-]+)$/u.exec(text);
    const ctx = last && last.index > 0 && known(last[2]);
    if (ctx) text = text.slice(0, last.index) + last[1] + "[[c/" + ctx + "]]";
  }
  text = text.replace(/(^|\s)#([\p{L}\p{N}_-]+)/gu, (m, sp, q) => {
    const hit = nameIndex().find(n => n.kind === "project" && n.title.toLowerCase().includes(q.toLowerCase()));
    return hit ? sp + "[[" + hit.ref + "]]" : m;
  });
  /* @ is a context, as it reads everywhere else. A person only when no
     context is called that and somebody is -- "@mia" from before @ meant
     contexts still hands it to Mia -- and otherwise a new context. */
  text = text.replace(/(^|\s)@([\p{L}\p{N}_-]+(?:\/[\p{L}\p{N}_-]+)*)/gu, (m, sp, q) => {
    const ctx = known(q);
    if (ctx) return contextOf(text) ? m : sp + "[[c/" + ctx + "]]";
    if (q.includes("/")) return contextOf(text) ? m : sp + "[[c/" + ctxSlug(q) + "]]";
    const hit = nameIndex().find(n => n.kind === "person" &&
      n.title.toLowerCase().split(/\s+/).some(w => w.startsWith(q.toLowerCase())));
    if (!hit) return contextOf(text) ? m : sp + "[[c/" + ctxSlug(q) + "]]";
    who = hit.title;
    return sp;
  });
  text = linkKnownNames(trim(text.replace(/\s{2,}/g, " ")));
  const made = contextOf(text);
  if (made && !contextList().includes(made)) mergeLookalikeContext(made);
  const blk = stampAuthor(newBlock({state: "TODO", title: text, props: {}}));
  if (due) setDue(blk, due);
  const when = w ? [{block: blk, w, keys: applyWhen(blk, Object.assign({}, w, {title: text}))}] : [];
  createLinkedPages(blk.title);
  page.blocks.push(blk);
  touch(path);
  if (who) assignBlock(path, blk, who);
  noteTodoTouched();
  coachMark("add");
  return {path, block: blk, who, when};
}
