function parseKindleNotes(raw) {
  const lines = String(raw || "").replace(/\r\n?/g, "\n").split("\n").map(trim).filter(l => l && l !== "Options");
  const head = [], items = [];
  let cur = null, marks = 0;
  for (const l of lines) {
    const m = KINDLE_MARK.exec(l);
    if (m) {
      marks++;
      const kind = m[1].toLowerCase();
      cur = kind === "bookmark" ? null : {kind, text: [], notes: []};
      if (cur) items.push(cur);
      continue;
    }
    if (/^={5,}$/.test(l)) { cur = null; continue; }
    if (!marks) { head.push(l); continue; }
    if (!cur) continue;                    // My Clippings names the book again before each one
    // The notebook on the web puts your note under the highlight, as "Note: ...".
    const note = /^note\s*:\s*(.*)$/i.exec(l);
    if (note && cur.kind === "highlight") { cur.notes.push(note[1]); cur.inNote = true; continue; }
    (cur.inNote ? cur.notes : cur.text).push(l);
  }
  if (marks < 2 || !head.length) return null;
  // "Title (Author)" in My Clippings; the title, then "by Author" or the author, elsewhere.
  let title = head[0], by = "";
  const paren = /^(.*\S)\s*\(([^()]+)\)$/.exec(title);
  if (paren) [title, by] = [paren[1], paren[2]];
  else if (head[1] && head[1].length <= 80 && !/\d+\s+(?:highlight|note)/i.test(head[1])) by = head[1].replace(/^by\s+/i, "");
  const blocks = [];
  for (const it of items) {
    const words = it.text.filter(Boolean);
    if (it.kind === "note" && blocks.length) {
      // A note goes under the highlight before it, which is where it was written.
      blocks[blocks.length - 1].children.push(...words.map(w => newBlock({title: w}, false)));
      continue;
    }
    if (!words.length) continue;
    const b = newBlock({title: words[0]}, false);
    b.children.push(...words.slice(1).concat(it.notes.filter(Boolean)).map(w => newBlock({title: w}, false)));
    blocks.push(b);
  }
  return blocks.length ? {title, by, blocks} : null;
}
