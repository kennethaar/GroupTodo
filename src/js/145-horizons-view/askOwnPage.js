function askOwnPage() {
  const base = askLang(), t = ASK_NOTE[base], q = "{" + t.qWords.join("|") + "}", m = mailWords();
  const text = {greet: [t.greet("%name%")],
    mw: [m.introAsk(2, 0)], mq: [askOneMore(n => m.introAsk(0, n))], mboth: [askOneMore(n => m.introAsk(2, n))], mhelp: [m.helpAsk],
    w: [t.intro({q: 0, w: 2}, "%file%", q)], q: [t.intro({q: 2, w: 0}, "%file%", q)],
    both: [t.intro({q: 2, w: 2}, "%file%", q)], add: [t.add], bye: [t.bye, "%me%"]};
  return {
    props: {title: "Update note", base, created: todayStamp(),
      help: "Email: is the email, the rest the plain text. " +
            "%name% their first name, %file% the sheet, %me% you, %count% how many, " +
            "%questions% a question or a few, {one|more} by how many"},
    blocks: ASK_OWN_PARTS.map(([part, key]) => newBlock({title: part.charAt(0).toUpperCase() + part.slice(1),
      children: text[key].map(title => newBlock({title}))})),
  };
}
