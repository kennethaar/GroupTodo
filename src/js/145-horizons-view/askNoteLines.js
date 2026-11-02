/* What each line says in the note, by its reference, as the importer reads it:
   everything above Answer: or Comment:, the lines under it included. */
function askNoteLines(body) {
  const lines = String(body || "").split(/\r?\n/), out = new Map();
  const REF = /^\s*(?:Reference|Referanse|Referens|Referenz)\b[^:]*:\s*(\S+)\s*$/i;
  const NOTE = /^\s*(?:Comment|Kommentar|Answer|Svar|Antwort):/i;
  let buf = [], noted = false;
  for (let i = lines.findIndex(l => trim(l) === "---") + 1; i > 0 && i < lines.length && trim(lines[i]) !== "---"; i++) {
    const line = lines[i], m = REF.exec(line);
    if (m) { out.set(m[1], buf); buf = []; noted = false; }
    else if (NOTE.test(line)) noted = true;
    else if (!noted && trim(line) && !ASK_SECTION_RE.test(line)) buf.push(line.replace(/\s+$/, ""));
  }
  return out;
}
