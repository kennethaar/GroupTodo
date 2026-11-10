/* mode: "inform" or "ask". items: {ref, t, word, color, struck, meta, comment,
   context: [{depth, text}], kind: "wait" | "question" | undefined}; an item
   without a ref (a project summary) is told but has no link. replyTo: your
   address, where every link replies to. Gives {subject, html, text, links}. */
function updateMail({mode, them, subject, items, ack, replyTo, greet}) {
  const w = mailWords(), refWord = (ASK_NOTE[askLang()] || ASK_NOTE.en).reference;
  // A question's reference ends in ?, so words about it come back as its answer.
  const refLine = refWord + " " + items.map(it => it.ref ? it.ref + (it.kind === "question" ? "?" : "") : "-").join(" ");
  const reply = (subj, line, said = "") => ({subject: subj,
    body: said + "\n\n\n--\n" + line + "\n" + refLine});
  const href = r => "mailto:" + encodeURIComponent(trim(replyTo || "")).replace(/%40/g, "@") +
    "?subject=" + encodeURIComponent(r.subject) + "&body=" + encodeURIComponent(r.body).replace(/%0A/g, "%0D%0A");
  const cards = items.map((it, i) => {
    const n = i + 1, title = mailCut(it.t);
    const links = !it.ref ? [] : mode === "inform" ? [[w.askAbout, reply(w.reQuestion(title), n + ": " + title)]]
      : it.kind === "question" ? [[w.answer, reply(w.reAnswer(title), n + ": " + title)]]
      : [[w.markDone, reply(w.reDone(title), n + " done: " + title)], [w.writeAbout, reply(w.reAbout(title), n + ": " + title)]];
    return {n, it, links};
  });
  const gotIt = mode === "inform" && ack ? reply("Re: " + subject, MAIL_GOT_IT, w.gotItSaid) : null;
  const F = "font-family:Segoe UI,Arial,sans-serif;", ink = "#15202b", grey = "#8190a0";
  /* Only what can be clicked looks clickable: the title links to the reply
     about it, asking gives each line one filled button, and the rest is
     quiet text. A status word is coloured text, not a bordered pill. When
     asking, the intro and the button already say question or wait, so the
     line says only what it is about. */
  const status = (label, c) => '<td style="' + F + "padding-right:10px;font-size:11.5px;" +
    "font-weight:bold;letter-spacing:.5px;text-transform:uppercase;color:" + c + ';">' + mailEsc(label) + "</td>";
  const link = ([label, r]) => '<a href="' + mailEsc(href(r)) + '" style="color:#2a7ae2;font-weight:bold;text-decoration:none;">' +
    mailEsc(label).replace("›", "&rsaquo;") + "</a>";
  const button = ([label, r]) => '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="display:inline-table;"><tr>' +
    '<td bgcolor="#2a7ae2" style="background:#2a7ae2;border-radius:6px;padding:8px 18px;mso-padding-alt:8px 18px;">' +
    '<a href="' + mailEsc(href(r)) + '" style="color:#ffffff;' + F + 'font-size:14.5px;font-weight:bold;text-decoration:none;display:inline-block;">' +
    mailEsc(label) + "</a></td></tr></table>";
  const facts = it => mode === "ask"
    ? [trim(it.about || "") ? w.about + " " + trim(it.about) : "", it.meta || ""].filter(Boolean).join(" · ")
    : it.meta || "";
  const card = ({n, it, links}) => '<tr><td style="padding:0 0 12px;">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #c9d1d9;border-radius:8px;">' +
    '<tr><td style="' + F + "padding:14px 16px 6px;font-size:16px;font-weight:bold;color:" + ink + ";" +
      (it.struck ? "text-decoration:line-through;" : "") + '"><span style="color:' + grey + ';">' + n + ".</span> " +
      (links.length ? '<a href="' + mailEsc(href(links[links.length - 1][1])) + '" style="color:#2a7ae2;text-decoration:' +
        (it.struck ? "line-through" : "none") + ';">' + mailEsc(it.t) + "</a>" : mailEsc(it.t)) + "</td></tr>" +
    (it.context || []).map(c => '<tr><td style="' + F + "padding:0 16px 4px " + (16 + c.depth * 16) + "px;font-size:13px;color:" + grey + ';">' +
      mailEsc(c.text) + "</td></tr>").join("") +
    ((mode !== "ask" && it.word) || facts(it) ? '<tr><td style="padding:2px 16px 10px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>' +
      (mode !== "ask" && it.word ? status(it.word, it.color || grey) : "") +
      (facts(it) ? '<td style="' + F + "font-size:13px;color:" + grey + ';">' + mailEsc(facts(it)) + "</td>" : "") +
      "</tr></table></td></tr>" : "") +
    (trim(it.comment || "") ? '<tr><td style="padding:0 16px 10px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>' +
      '<td width="3" bgcolor="' + (it.color || grey) + '" style="background:' + (it.color || grey) + ';width:3px;font-size:0;line-height:0;">&nbsp;</td>' +
      '<td style="' + F + "padding:2px 0 2px 12px;font-size:14.5px;color:" + ink + ';">' + mailEsc(trim(it.comment)).replace(/\n/g, "<br>") + "</td>" +
      "</tr></table></td></tr>" : "") +
    (links.length ? '<tr><td style="' + F + 'padding:2px 16px 14px;font-size:13.5px;">' +
      (mode === "ask" ? button(links[0]) + links.slice(1).map(l => "&nbsp;&nbsp;&nbsp;" + link(l)).join("")
        : links.map(link).join('<span style="color:' + grey + ';">&nbsp;&nbsp;·&nbsp;&nbsp;</span>')) + "</td></tr>" : "") +
    "</table></td></tr>";
  const k = {w: items.filter(it => it.kind !== "question").length, q: items.filter(it => it.kind === "question").length};
  /* Personalize text reaches the mail too, part by part, so the page you
     edit is the text they read (#162). A part the page leaves out keeps the
     standard words. */
  const own = !askOwn() ? {} : mode === "inform" ? informOwnParts() : askOwnParts();
  const fill = (s, n) => s.replace(/%name%/gi, firstNameOf(them)).replace(/%me%/gi, whoAmI() || "")
    .replace(/%count%/gi, String(n)).replace(/\{([^{}|]*)\|([^{}]*)\}/g, (_, one, more) => (n === 1 ? one : more));
  const part = (key, built, n) => own[key] != null ? fill(own[key], n) : built;
  const which = !k.q ? "mw" : !k.w ? "mq" : "mboth";
  const intro = mode === "inform" ? part("mintro", w.intro(items.length), items.length)
    : part(which, w.introAsk(k.w, k.q), which === "mw" ? k.w : k.q);
  const help = mode === "inform"
    ? [gotIt ? part("mack", w.helpAck, items.length) : "", part("mhelp", w.help, items.length)].filter(l => trim(l)).join(" ")
    : part("mhelp", w.helpAsk, items.length);
  const html = '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="' + F +
      "font-size:15px;line-height:1.5;color:" + ink + ';max-width:600px;">' +
    '<tr><td style="' + F + 'padding:0 0 14px;">' + mailEsc(greet) + "</td></tr>" +
    '<tr><td style="' + F + 'padding:0 0 16px;">' + mailEsc(intro) + "</td></tr>" +
    cards.map(card).join("") +
    (gotIt ? '<tr><td style="padding:8px 0;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>' +
      '<td bgcolor="#1a7f4f" style="background:#1a7f4f;border:1px solid #1a7f4f;border-radius:6px;padding:10px 18px;mso-padding-alt:10px 18px;">' +
      '<a href="' + mailEsc(href(gotIt)) + '" style="color:#ffffff;' + F + 'font-size:15px;font-weight:bold;text-decoration:none;display:inline-block;">' +
      mailEsc(w.gotIt) + "</a></td></tr></table></td></tr>" : "") +
    '<tr><td style="' + F + "padding:" + (gotIt ? "4px" : "8px") + ' 0 8px;font-size:13px;color:#7d8c99;">' + mailEsc(help) + "</td></tr>" +
    '<tr><td style="' + F + 'padding:0 0 18px;font-size:12px;color:#6e7b88;">' +
      // In English whatever the mail's language: the name reads better that way (#163).
      'Powered by <a href="https://github.com/kennethaar/GroupTodo" style="color:#2a7ae2;font-weight:bold;text-decoration:none;">GroupToDo</a></td></tr>' +
    '<tr><td style="' + F + "font-size:11px;color:" + grey + ';">' + mailEsc(refLine) + "</td></tr>" +
    "</table>";
  // No sign-off in either: their own mail signature follows the paste.
  const text = [greet, "", intro, "",
    ...cards.flatMap(({n, it}) => [n + ". " + it.t,
      ...(it.context || []).map(c => ASK_IND + "  ".repeat(c.depth) + c.text),
      ...(mode === "ask" ? (facts(it) ? [ASK_IND + facts(it)] : [])
        : it.word ? [ASK_IND + it.word + (it.meta ? " · " + it.meta : "")] : []),
      ...String(it.comment || "").split(/\r?\n/).filter(l => trim(l)).map(l => ASK_IND + trim(l)), ""]),
    help, "", refLine].join("\n");
  const links = [...cards.flatMap(c => c.links.map(([, r]) => href(r))), ...(gotIt ? [href(gotIt)] : [])];
  return {subject, html, text, links};
}
