/* The AI's catch-up answer (#516), read past its bullets, numbers, bold and
   code fences, as rows of changes: {kind, ref, path, block, proj, text, who,
   date, outcome, next, on}. A reference the prompt did not give, a task that is
   no longer open, or a new project with the name of one you have, is left out.
   Every row starts ticked but a new project: that is a new commitment. */
function parseCatchUp(raw, refs) {
  const rows = [];
  const LINE = /^(DONE|DUE|NOTE|NEXT|WAIT|PROJECT)\b\s*:?\s*(.*)$/i;
  const REF = /^\[?([TP]\d+)\]?\s*[:\-–—]?\s*(.*)$/i;
  const dateIn = s => (/\d{4}-\d{2}-\d{2}/.exec(s) || [])[0] || (trim(s) ? dateFromWords(trim(s)) : null) || null;
  const live = r => {
    if (!r.block) return true;
    let found = false;
    walkBlocks((getPage(r.path) || {}).blocks || [], b => { if (b === r.block) found = true; });
    return found;
  };
  const named = new Set();
  for (let line of String(raw || "").split(/\r?\n/)) {
    line = trim(line.replace(/\*\*|__|`/g, "").replace(/^\s*(?:>\s*)*(?:[-*•·]|\d+[.)])?\s*/, ""));
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
      rows.push({kind, text: title, outcome, next, on: false});
      continue;
    }
    const rm = REF.exec(rest);
    const ref = rm && refs.get(rm[1].toUpperCase());
    if (!ref || !live(ref)) continue;
    rest = trim(rm[2]);
    const row = {kind, ref: rm[1].toUpperCase(), path: ref.path, block: ref.block || null, proj: ref.proj, on: true};
    if (kind === "done") {
      if (!row.block || !OPEN_STATES[row.block.state]) continue;
    } else if (kind === "due") {
      row.date = dateIn(rest);
      if (!row.block || !row.date || row.date === dueDate(row.block)) continue;
    } else if (kind === "note") {
      if (!row.block || !rest) continue;
      row.text = rest;
    } else if (kind === "next") {
      if (!rest) continue;
      row.text = rest;
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
