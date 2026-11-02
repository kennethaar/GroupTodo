function parseEmailText(raw) {
  const lines = String(raw || "").replace(/\r\n?/g, "\n").split("\n").map(l => l.replace(/\s+$/, ""));
  const next = i => { for (let k = i + 1; k < lines.length; k++) if (trim(lines[k])) return k; return -1; };
  const prev = i => { for (let k = i - 1; k >= 0; k--) if (trim(lines[k])) return k; return -1; };
  const finish = (mail, from) => {
    let body = lines.slice(from).map(l => trim(l));
    while (body.length && (!body[body.length - 1] || MAIL_BUTTONS.test(body[body.length - 1]))) body.pop();
    while (body.length && !body[0]) body.shift();
    if (!body.length) return null;
    const who = mailSender(mail.from || "");
    return Object.assign(mail, {name: who.name, email: who.email, body,
      subject: trim(mail.subject) || body[0].slice(0, 60)});
  };
  const head = Math.min(lines.length, 25);

  /* Outlook on the web: subject, sender, (date,) a gap, then the people it
     went to with a ";" between them, and no "From:" or "To:" anywhere. It is
     read from the top, ahead of the others: a reply carries the mails before
     it further down, each with a "From:" of its own. */
  const short = l => { l = trim(l); return l.length > 0 && l.length <= 80 && !BULLET_RE.test(l) && !/[.!?:]$/.test(l); };
  const named = l => looksLikeEmail(trim(l)) || /^\p{Lu}[\p{L}'’.-]*(?:\s+[\p{L}'’.-]+){1,4}$/u.test(trim(l));
  const fromWeb = () => {
    let subj = next(-1);
    while (subj >= 0 && MAIL_LABELS.test(trim(lines[subj]))) subj = next(subj);
    const s = subj < 0 ? -1 : next(subj);
    if (s < 0 || trim(lines[subj]).length > 200 || BULLET_RE.test(lines[subj]) || !short(lines[s])) return null;
    let i = next(s), sent = "";
    if (i >= 0 && isMailDateLine(lines[i])) { sent = lines[i]; i = next(i); }
    // Outlook leaves a gap between the sender and the people; a list does not.
    if (i < 0 || !lines.slice(s + 1, i).some(l => !trim(l))) return null;
    const names = [];
    let k = i;
    for (; k < lines.length && trim(lines[k]); k++) {
      const l = trim(lines[k]);
      if (MAIL_HEAD.cc.test(l)) continue;
      if (k > i && !/;$/.test(trim(lines[k - 1]))) break;
      names.push(...l.split(";").map(trim).filter(Boolean));
    }
    if (!names.length || !names.every(n => n.length <= 80 && !/[.!?]$/.test(n))) return null;
    // Sent to one person there is no ";", so both lines have to read as full names.
    if (k === i + 1 && !lines[i].includes(";") && !(named(lines[s]) && named(names[0]))) return null;
    let from = k;
    const after = next(k - 1);
    if (!sent && after >= 0 && isMailDateLine(lines[after])) { sent = lines[after]; from = after + 1; }
    return finish({from: trim(lines[s]), subject: trim(lines[subj]), to: names.join("; "),
      sent: sent ? mailDateISO(sent) : ""}, from);
  };
  const web = fromWeb();
  if (web) return web;

  // Outlook and forwards: From: ... Sent: ... To: ... Subject: ...
  for (let i = 0; i < head; i++) {
    if (!MAIL_HEAD.from.test(trim(lines[i]))) continue;
    const mail = {};
    let k = i;
    for (; k < lines.length && trim(lines[k]); k++) {
      const l = trim(lines[k]);
      const key = Object.keys(MAIL_HEAD).find(h => MAIL_HEAD[h].test(l));
      if (!key) break;
      if (!(key in mail)) mail[key] = trim(MAIL_HEAD[key].exec(l)[1]);
    }
    if (!("subject" in mail) && !("sent" in mail)) continue;
    if (mail.sent) mail.sent = mailDateISO(mail.sent);
    return finish(mail, k);
  }

  // Gmail: subject, sender, (date,) "to ...", (date,) words.
  for (let i = 0; i < head; i++) {
    const t = MAIL_TO_LINE.exec(trim(lines[i]));
    if (!t) continue;
    const after = next(i);
    const listed = MAIL_ME.test(t[1]) || /[,@]|\+\d+\s*$/.test(t[1]);
    if (!listed && !(after >= 0 && isMailDateLine(lines[after]))) continue;
    let s = prev(i), sent = "";
    if (s >= 0 && isMailDateLine(lines[s])) { sent = lines[s]; s = prev(s); }
    // A line of an outline is never the sender or the subject.
    if (s < 0 || trim(lines[s]).length > 100 || BULLET_RE.test(lines[s])) continue;
    let subj = prev(s);
    while (subj >= 0 && MAIL_LABELS.test(trim(lines[subj]))) subj = prev(subj);
    if (subj >= 0 && BULLET_RE.test(lines[subj])) continue;
    let from = i + 1;
    if (!sent && after >= 0 && isMailDateLine(lines[after])) { sent = lines[after]; from = after + 1; }
    return finish({
      from: trim(lines[s]),
      subject: subj >= 0 ? trim(lines[subj]) : "",
      to: MAIL_ME.test(t[1]) ? "" : trim(t[1]),
      sent: sent ? mailDateISO(sent) : "",
    }, from);
  }

  return null;
}
