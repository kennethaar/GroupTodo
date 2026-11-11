/* A reply copied out of a Teams chat (#352). The message Send in Teams wrote
   ends each task with its reference in brackets, "(Work-42uf8znz)", so
   everything up to the last of those is your own message, and what follows
   is the reply. "2: words" or "2 done" is about task 2; other words go on
   with the task before them, or with the only one. A Teams copy may carry
   who wrote each message, "Lars Haugen 10:42", "[10:42] Lars Haugen", or
   the name with the time on the next line: what follows your own name starts
   unticked. Gives {from, refs, lines: [{text, said, done, ref, mine, on,
   para}], unclear}, or null when there is no reference. unclear: more than
   one answer, a back and forth, or words that are not about one task, which
   Paste a reply shows line by line to untick. */
function parseTeamsReply(text) {
  const raw = String(text || "").split(/\r?\n/).map(l => trim(l));
  const REF = /\(([^()\s][^()]*-[A-Za-z0-9]{4,})\)$/;
  const refs = [];
  let last = -1;
  raw.forEach((l, i) => {
    const m = REF.exec(l);
    if (!m) return;
    if (!refs.includes(m[1])) refs.push(m[1]);
    last = i;
  });
  if (last < 0) return null;

  const me = whoAmI() || "";
  const TIME = "\\d{1,2}[:.]\\d{2}(?:\\s?[AaPp]\\.?[Mm]\\.?)?", DATE = "(?:\\d{1,4}[./-]\\d{1,2}(?:[./-]\\d{1,4})?,?\\s+)?";
  const timeOnly = new RegExp("^\\[?" + DATE + TIME + "\\]?$");
  const timeFirst = new RegExp("^\\[" + DATE + TIME + "\\]\\s*(.+)$");
  const timeLast = new RegExp("^(.+?),?\\s+" + DATE + TIME + "$");
  // A display name: two to four capitalised words, or yours however it is written.
  const NAME = /^[\p{Lu}][\p{L}'’.-]*(?:\s+[\p{Lu}][\p{L}'’.-]*){1,3}$/u;
  const isMe = n => !!me && (samePerson(n, me) || n.toLowerCase() === me.toLowerCase());
  const speaker = (l, next) => {
    const m = timeFirst.exec(l) || timeLast.exec(l);
    if (m && (isMe(trim(m[1])) || NAME.test(trim(m[1])))) return trim(m[1]);
    if (next && timeOnly.test(next) && (isMe(l) || NAME.test(l))) return l;
    return isMe(l) ? l : null;
  };
  const doneRe = new RegExp("^(?:re\\s*)?(\\d+)\\s*[.:)\\-]?\\s*(?:" + MAIL_DONE_WORDS + ")\\s*[.!]?$", "iu");
  const numRe = /^(?:re\s*)?(\d+)\s*[.:)\-]\s*(\S.*)$/i;

  const lines = [];
  let from = "", mine = false, gap = false, para = 0, ref = refs.length === 1 ? refs[0] : null;
  for (let i = last + 1; i < raw.length; i++) {
    const l = raw[i];
    if (!l) { gap = true; continue; }
    if (timeOnly.test(l)) continue;
    const who = speaker(l, raw.slice(i + 1).find(Boolean));
    if (who) {
      mine = isMe(who);
      if (!mine && !from) from = who;
      gap = true;
      continue;
    }
    if (gap && lines.length) para++;
    gap = false;
    let m, said = l, done = false;
    if ((m = doneRe.exec(l)) && refs[+m[1] - 1]) { ref = refs[+m[1] - 1]; said = ""; done = true; }
    else if ((m = numRe.exec(l)) && refs[+m[1] - 1]) { ref = refs[+m[1] - 1]; said = m[2]; }
    lines.push({text: l, said, done, ref, mine, on: !mine, para});
  }
  const answers = new Set(lines.map(l => l.ref));
  const unclear = answers.size > 1 || answers.has(null) || lines.some(l => l.mine) ||
    new Set(lines.map(l => l.para)).size > 1;
  return {from, refs, lines, unclear};
}
