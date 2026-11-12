/* The references in the note are for the importer, not for them to read
   (#372): they come out of the message you edit, kept by the number of the
   line each closes, and askNoteJoin puts them back when the note goes. */
function askNoteSplit(body) {
  const REF = /^\s*(?:Reference|Referanse|Referens|Referenz)\b[^:]*:\s*(\S+)\s*$/i;
  const out = [], refs = new Map();
  let n = null;
  for (const line of String(body || "").split("\n")) {
    const m = /^(\d+)[.)]\s/.exec(line);
    if (m) n = m[1];
    if (n != null && REF.test(line)) {
      // The blank line before it is the reference's, and goes with it.
      if (out.length && !trim(out[out.length - 1])) out.pop();
      refs.set(n, line);
      continue;
    }
    out.push(line);
  }
  return {text: out.join("\n"), refs};
}
