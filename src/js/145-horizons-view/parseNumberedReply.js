function parseNumberedReply(text) {
  text = String(text || "");
  const lines = text.split(/\r?\n/).map(l => l.replace(/^(?:[ \t]*>)+[ \t]?/, ""));
  const refAt = lines.findIndex(l => /^\s*(?:Reference|Referanse|Referens|Referenz)\b[^:]*:\s*\S/i.test(l));
  if (refAt < 0) return null;
  const refs = lines[refAt].replace(/^[^:]*:\s*/, "").split(/[\s,]+/).filter(Boolean);
  // The older formats have boxes, Comment: and Answer:; those are theirs.
  if (lines.some(l => /^\s*(?:(?:[-*•·]|\d+[.)])\s*)?\[[^\[\]]*\]\s*\S/.test(l) ||
    /^\s*(?:Comment|Kommentar|Answer|Svar|Antwort):/i.test(l))) return null;
  const mailFrom = lines.map(l => /^\s*(?:From|Fra|Från|Von):\s*(.+)$/i.exec(l)).find(Boolean);
  const from = mailFrom ? trim(mailFrom[1].replace(/<[^>]*>/g, "").replace(/["']/g, "")) : "";
  // What they wrote ends at the fence of a clicked reply, or where the quote of the mail begins.
  const quoteAt = text.split(/\r?\n/).findIndex(l => /^\s*>/.test(l) || /^\s*(?:On .* wrote:|From:|Fra:|Från:|Von:|-----)/i.test(l));
  const fence = lines.findIndex(l => /^\s*--\s*$/.test(l));
  const stop = [quoteAt, fence, refAt].filter(i => i >= 0).reduce((a, b) => Math.min(a, b), lines.length);
  const foot = fence >= 0 ? trim(lines[fence + 1] || "") : "";
  const footM = /^(\d+)(\s+done)?:/i.exec(foot);
  const gotIt = new RegExp("^(?:" + MAIL_GOT_IT + "|ok)$", "i").test(foot);
  const out = [], loose = [];
  let cur = null;
  const doneRe = new RegExp("^(?:re\\s*)?(\\d+)\\s*[.:)\\-]?\\s*(?:" + MAIL_DONE_WORDS + ")\\s*[.!]?$", "iu");
  for (const raw of lines.slice(0, stop)) {
    const line = trim(raw);
    let m;
    if (!line) { cur = null; continue; }
    if ((m = doneRe.exec(line))) { out.push({n: +m[1], done: true, note: ""}); cur = null; }
    else if ((m = /^(?:re\s*)?(\d+)\s*[.:)\-]\s*(\S.*)$/i.exec(line)) || (m = /^re\s*(\d+)\s+(\S.*)$/i.exec(line))) {
      cur = {n: +m[1], done: false, note: m[2]}; out.push(cur);
    }
    else if (cur) cur.note += " " + line;
    else loose.push(line);
  }
  /* Greetings, sign-offs and a name on its own are not about any task, and
     the words a Got it link writes in are the Got it itself. */
  const THANKS = MAIL_THANKS_RE;
  const said = loose.filter(l => !/^(?:hi|hello|dear|hej|hei|hallo)\b/i.test(l) &&
    !/^(?:best|kind regards|regards|br|mvh|med vennlig hilsen|vh|venlig hilsen|hälsningar|viele grüße|gruß|grüße)\b/i.test(l) &&
    !/^[\p{Lu}][\p{L}\-]*\.?$/u.test(l));
  let rest = said.filter(l => !THANKS.test(l)).join(" ").replace(/\s+/g, " ").trim();
  for (const w of Object.values(MAIL_WORDS))
    if (rest.toLowerCase().startsWith(w.gotItSaid.toLowerCase())) rest = trim(rest.slice(w.gotItSaid.length));
  const ack = gotIt || (!out.length && !footM && said.length > 0 && said.every(l => THANKS.test(l)));
  if (footM && rest) { out.push({n: +footM[1], done: !!footM[2], note: rest}); rest = ""; }
  else if (footM && footM[2] && !out.some(o => o.n === +footM[1])) out.push({n: +footM[1], done: true, note: ""});
  const real = refs.filter(r => r !== "-").map(r => r.replace(/\?$/, ""));
  const items = out.filter(o => refs[o.n - 1] && refs[o.n - 1] !== "-").map(o => {
    const q = refs[o.n - 1].endsWith("?"), note = trim(o.note);
    // Words on a question are its answer, which is what makes it answered.
    return Object.assign({ref: refs[o.n - 1].replace(/\?$/, ""), t: "", numbered: true, done: o.done || (q && !!note), note},
      q && note ? {answered: true} : {});
  });
  if (ack) for (const ref of real) items.push({ref, t: "", numbered: true, ack: true, done: false, note: ""});
  if (!items.length && !rest) return null;
  return {from, items, loose: rest, refs: real};
}
