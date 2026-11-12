/* The note as it goes: each line's reference back at the end of that line's
   part, before the next number, heading or closing ---. A line you deleted
   takes its reference with it. */
function askNoteJoin(text, refs) {
  const out = [];
  let n = null;
  const flush = () => {
    if (n != null && refs.has(n)) {
      let blanks = 0;
      while (out.length && !trim(out[out.length - 1])) { out.pop(); blanks++; }
      out.push("", refs.get(n));
      for (; blanks > 0; blanks--) out.push("");
    }
    n = null;
  };
  for (const line of String(text || "").split("\n")) {
    const m = /^(\d+)[.)]\s/.exec(line);
    if (m || trim(line) === "---" || ASK_SECTION_RE.test(line)) flush();
    if (m) n = m[1];
    out.push(line);
  }
  flush();
  return out.join("\n");
}
