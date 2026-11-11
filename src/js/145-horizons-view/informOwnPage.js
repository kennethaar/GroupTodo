function informOwnPage() {
  const t = informWords(), m = mailWords();
  return {
    props: {title: "Inform note", base: askLang(), created: todayStamp(),
      help: "Email: is the email, the rest the plain text. " +
            "%name% their first name, %me% you, %file% the sheet, %count% how many lines, {one|more} by how many"},
    blocks: INFORM_OWN_PARTS.map(([part, key]) => newBlock({title: part.charAt(0).toUpperCase() + part.slice(1),
      children: ({greet: [t.greet("%name%")], mintro: [askOneMore(m.intro)], mack: [m.helpAck], mhelp: [m.help],
        intro: [t.intro(2)], sheet: [t.sheet("%file%")], bye: []})[key]
        .map(title => newBlock({title}))})),
  };
}
