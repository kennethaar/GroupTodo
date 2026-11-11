/* ---------- their reply, coming back ---------- */
function parseUpdateReply(text) {
  text = String(text || "");
  // A reply to the update mail; the sheet's and the plain note's formats below.
  const numbered = parseNumberedReply(text);
  if (numbered) return numbered;
  // A reply copied out of Teams, with the message it answers (#352).
  const teams = parseTeamsReply(text);
  if (teams) return teamsReplyData(teams);
  /* A reply written in the mail is usually quoted ("> - [x] ..."), so the quote
     marks come off first. Spacing is whatever their fingers did: [ x ], [x  ],
     -[x]Task. Mail programs turn the dash into a bullet, or drop it. An x in
     the brackets is done; anything else they write there is a comment. A
     question has no box: what they write after Answer: is the answer, and an
     answer is what makes it answered. */
  const lines = text.split(/\r?\n/).map(l => l.replace(/^(?:[ \t]*>)+[ \t]?/, ""));
  // "1. [ ] Task", the number the note gives each line, or a bullet.
  const TASK = /^\s*(?:(?:[-*•·]|\d+[.)])\s*)?\[([^\[\]]*)\]\s*(\S.*)$/;
  const DONE = /^\s*[xX✓✔]\s*$/;
  const NOTE = /^\s*(Comment|Kommentar|Answer|Svar|Antwort):\s?(.*)$/i;  // Kommentar in sv, no, da and de
  const ANSWER = /^(?:Answer|Svar|Antwort)$/i;
  // "Referanse (ikke endre): Work-d0n86bq4", the area and the task's id::.
  const REF  = /^\s*(?:Reference|Referanse|Referens|Referenz)\b[^:]*:\s*(\S+)\s*$/i;
  /* Only the block is read: from the --- that opens it to the --- that closes
     it, so the bracketed image names a mail program leaves behind, or a
     checkbox in the signature, are not taken for answers. */
  const opens = i => {
    for (let j = i + 1; j < lines.length && trim(lines[j]) !== "---"; j++)
      if (TASK.test(lines[j]) || REF.test(lines[j])) return true;
    return false;
  };
  let first = lines.findIndex((l, i) => trim(l) === "---" && opens(i));
  if (first >= 0) first++;
  else first = lines.findIndex(l => TASK.test(l));
  if (first < 0) first = lines.findIndex(l => REF.test(l)) < 0 ? -1 : 0;
  if (first < 0) return null;
  /* Who it is from is the task's own business: each one is waiting on
     somebody. The mail's From: line above the block is only the fallback, for
     a task that has been closed or reassigned since it was asked. */
  const mailFrom = lines.slice(0, first).map(l => /^\s*(?:From|Fra):\s*(.+)$/i.exec(l)).find(Boolean);
  const from = mailFrom ? trim(mailFrom[1].replace(/<[^>]*>/g, "").replace(/["']/g, "")) : "";
  /* One item runs to its reference. A box starts one, and so does the first
     line of words after the last reference, which is how a question begins. */
  const items = [];
  let cur = null;
  const start = () => (cur = {done: false, t: "", notes: [], inNote: false, box: null, answer: false});
  const finish = () => {
    if (!cur) return;
    const note = trim(cur.notes.join("\n"));
    const answered = cur.box == null && cur.answer && !!note;
    if (cur.box != null || cur.ref)
      items.push(Object.assign({done: cur.done || answered, t: cur.t, note}, cur.ref ? {ref: cur.ref} : {},
        answered ? {answered} : {}));
    cur = null;
  };
  for (let i = first; i < lines.length && trim(lines[i]) !== "---"; i++) {
    const line = lines[i], task = TASK.exec(line);
    let m;
    if (task) {
      // Boxes with no references between them are a checklist, one line each.
      if (cur && cur.box != null) finish();
      if (!cur) start();
      const box = trim(task[1]);
      cur.box = box; cur.done = DONE.test(box); cur.inNote = false;
      if (!cur.done && box) cur.notes.push(box);
      cur.t = trim(task[2]);
    } else if ((m = NOTE.exec(line))) {
      if (!cur) start();
      // A comment runs on over the lines under it until the reference.
      cur.notes.push(m[2]); cur.inNote = true;
      if (ANSWER.test(m[1])) cur.answer = true;
    } else if ((m = REF.exec(line))) {
      if (!cur) start();
      cur.ref = m[1];
      finish();
    } else if (cur && cur.inNote) cur.notes.push(line.replace(/^\s+/, ""));  // the block's indent is not theirs
    else if (trim(line) && !ASK_SECTION_RE.test(line)) {
      if (!cur) start();
      if (!cur.t) cur.t = trim(line.replace(/^\s*(?:[-*•·]|\d+[.)])\s*/, ""));
    }
  }
  if (cur && cur.box != null) finish();
  // Without a single reference it is just a checklist, not somebody's answer.
  return items.some(i => i.ref) ? {from, items} : null;
}
