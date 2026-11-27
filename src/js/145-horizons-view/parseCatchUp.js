/* The AI's catch-up answer (#516), read past its bullets, numbers, bold and
   code fences, as rows of changes: {kind, ref, path, block, proj, text, who,
   date, outcome, next, ctx, url, choice}; a TODO or PROJECT has no ref. A
   reference the prompt did not give, a task that is no longer open, or a new
   project with the name of one you have, is left out. Each row starts on the
   likely GTD choice (CATCHUP_CHOICES): a new next action as Next, a date as a
   Deadline, the rest as Keep. A new to-do or project is only taken ("take")
   or not: Clarify decides what it is. */
function parseCatchUp(raw, refs) {
  const rows = [];
  const LINE = /^(DONE|DUE|NOTE|NEXT|WAIT|TODO|PROJECT)\b\s*:?\s*(.*)$/i;
  const REF = /^\[?([TP]\d+)\]?\s*[:\-–—]?\s*(.*)$/i;
  const dateIn = s => (/\d{4}-\d{2}-\d{2}/.exec(s) || [])[0] || (trim(s) ? dateFromWords(trim(s)) : null) || null;
  const live = r => {
    if (!r.block) return true;
    let found = false;
    walkBlocks((getPage(r.path) || {}).blocks || [], b => { if (b === r.block) found = true; });
    return found;
  };
  // Its context, @ and the name of one of yours as a whole word, wherever the AI put it; the rest is the action.
  const withContext = (row, rest) => {
    row.ctx = "";
    for (const c of contextList().slice().sort((x, y) => y.length - x.length)) {
      const at = rest.toLowerCase().indexOf("@" + c.toLowerCase());
      if (at < 0 || /[\p{L}\p{N}]/u.test(rest[at + c.length + 1] || "")) continue;
      row.ctx = c;
      return trim(rest.slice(0, at) + rest.slice(at + c.length + 1)).replace(/\s{2,}/g, " ");
    }
    return rest;
  };
  const named = new Set();
  /* Copied out of a chat, the lines can come run together on one line. A
     change begins at its word in capitals: with a reference after it, or
     TODO or PROJECT, so "done" or "Project" in a sentence stays in that sentence. */
  const text = String(raw || "").replace(/\s+(?=(?:DONE|DUE|NOTE|NEXT|WAIT)\s+\[?[TP]\d+\b|(?:TODO|PROJECT)\s)/g, "\n");
  for (let line of text.split(/\r?\n/)) {
    line = trim(line.replace(/\*\*|__|`/g, "").replace(/^\s*(?:>\s*)*(?:[-*•·]|\d+[.)])?\s*/, ""));
    // A citation mark an assistant adds, such as 【13-0d56c5】 or [^1], is no part of the change.
    line = trim(line.replace(/\s*(?:【[^】]*】|\[\^\d+\])/g, ""));
    // NO-DATE, where the prompt asks for it, is no date.
    line = trim(line.replace(/\s*\|\s*NO[- ]?DATE\b/gi, ""));
    /* Where it was found: a | part that is only a link, wherever it stands, or
       a link at the end; bare, in <>, or as [label](link). A bare [1] is let go. */
    let url = null;
    const LINK = /^(?:\[[^\]]*\]\((https?:\/\/[^\s)]+)\)|<?(https?:\/\/[^\s<>|]+)>?)$/;
    const parts = line.split(/\s+\|\s*|\s*\|\s+/);
    for (let i = parts.length - 1; i > 0; i--) {
      const lm = LINK.exec(trim(parts[i]).replace(/(?:\s*\[\d+\])+$/, ""));
      if (lm) { url = lm[1] || lm[2]; parts.splice(i, 1); break; }
    }
    line = parts.join(" | ");
    if (!url) line = trim(line.replace(/\s*\|?\s*(?:\[[^\]]*\]\((https?:\/\/[^\s)]+)\)|<?(https?:\/\/[^\s<>]+)>?)\s*$/,
      (_, a, b) => { url = a || b; return ""; }));
    // A name or a word written as a link, such as a search for a person, reads as its words.
    line = trim(line.replace(/\[([^\]]+)\]\(https?:\/\/[^\s)]+\)/g, "$1").replace(/(?:\s*\[\d+\])+\s*$/, "").replace(/\s*\|\s*$/, ""));
    const m = LINE.exec(line);
    if (!m) continue;
    const kind = m[1].toLowerCase();
    let rest = trim(m[2]);
    if (kind === "project") {
      const [title, outcome = "", next = ""] = rest.split("|").map(s => trim(s));
      if (!title || named.has(title.toLowerCase())) continue;
      const slug = slugify(title);
      if (["-", "0", "1", "2", "3"].some(c => V.pages.has(join(STATUS_DIRS[c], slug + ".md")))) continue;
      named.add(title.toLowerCase());
      rows.push({kind, text: title, outcome, next, url, choice: "take"});
      continue;
    }
    // A to-do in none of your projects, with its context and date, whichever | part holds the date.
    if (kind === "todo") {
      const bits = rest.split("|").map(s => trim(s));
      let when = null;
      for (let i = bits.length - 1; i > 0 && !when; i--) if ((when = dateIn(bits[i]))) bits.splice(i, 1);
      const row = {kind, text: "", date: when, url, choice: "take"};
      row.text = withContext(row, trim(bits.join(" ")));
      if (row.text && !rows.some(r => r.kind === "todo" && r.text.toLowerCase() === row.text.toLowerCase())) rows.push(row);
      continue;
    }
    const rm = REF.exec(rest);
    const ref = rm && refs.get(rm[1].toUpperCase());
    if (!ref || !live(ref)) continue;
    rest = trim(rm[2]);
    const row = {kind, ref: rm[1].toUpperCase(), path: ref.path, block: ref.block || null, proj: ref.proj, url,
      choice: CATCHUP_CHOICES[kind][0][0]};
    if (kind === "done") {
      if (!row.block || !OPEN_STATES[row.block.state]) continue;
    } else if (kind === "due") {
      row.date = dateIn(rest);
      if (!row.block || !row.date || row.date === dueDate(row.block)) continue;
    } else if (kind === "note") {
      // On a task, news on it; on a project, progress that has no task of its own.
      if (!rest) continue;
      row.text = rest;
    } else if (kind === "next") {
      rest = withContext(row, rest);
      if (!rest) continue;
      row.text = rest;
    } else if (kind === "wait" && row.block) {
      // A task of yours that someone else now does: it waits on them.
      const [who = "", when = ""] = rest.split("|").map(s => trim(s));
      if (!who || !OPEN_STATES[row.block.state] || row.block.state === "WAIT") continue;
      row.who = who.replace(/^\[\[(?:p\/)?|\]\]$/g, "");
      row.text = plainTitle(row.block.title);
      row.date = when ? dateIn(when) : null;
    } else if (kind === "wait") {
      const [who = "", what = "", when = ""] = rest.split("|").map(s => trim(s));
      if (!who || !what) continue;
      row.who = who.replace(/^\[\[(?:p\/)?|\]\]$/g, "");
      row.text = what;
      row.date = when ? dateIn(when) : null;
    }
    if (!rows.some(r => r.kind === row.kind && r.ref === row.ref && r.text === row.text)) rows.push(row);
  }
  return rows;
}
