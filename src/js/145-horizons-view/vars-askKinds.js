/* ---------- the note that carries the sheet ----------
   They are about to get an HTML attachment from somebody, which is the shape of
   a phishing mail. The note has to earn the open, and a logo will not do it.
   Two things will: the items are named, because a stranger could not have known
   them, and they are told outright that they can ignore the attachment and just
   reply. A request nobody is allowed to refuse is a request people learn to
   ignore.

   No em dashes in here. It lands in somebody's mail client, where a dash that
   is not on the keyboard reads as something a machine wrote, and the whole job
   of this note is to read as though a person wrote it. */
/* The subject names the first line, as before. A mail that is only questions
   says so, because "Waiting for" on a question reads as a reproach. */
const askKinds = items => ({q: items.filter(i => i.q).length, w: items.filter(i => !i.q).length});
/* intro(k, file, q): q is "a question" or "a few questions" already picked
   for k.q, so the personalized page can be seeded with {one|more} in its place. */
const askSubject = (wait, ask, more, empty) => (items, them) =>
  (askKinds(items).w ? wait : ask) + ' "' +
  askLineTitle(items[0] || {title: empty}, them) +
  '"' +
  (items.length > 1 ? " + " + (items.length - 1) + " " + more : "");
const ASK_NOTE = {
  en: {
    label: "English",
    subject: askSubject("Waiting for", "Question about", "more", "update"),
    qWords: ["a question", "a few questions"],
    intro: (k, file, q) =>
      !k.q ? "I am waiting for an update on the items below. Tick them in the attached " + file + " and send it, or reply directly to this email with an x between the brackets [x] for what is done. Replies are read in automatically, so please leave the references as they are."
    : !k.w ? "I need a quick update on the items below. Fill in the attached " + file + " and send it, or reply directly to this email and write your answer right after Answer: under each item. Replies are read in automatically, so please leave the references as they are."
           : "Below are things I am waiting for from you, and " + q + ". Fill in the attached " + file +
             " and send it, or reply directly to this email: an x between the brackets [x] for what is done, and your answer right after Answer: under each question. Replies are read in automatically, so please leave the references as they are.",
    // Without the sheet: the same, answered by a plain reply.
    mail: (k, q) =>
      !k.q ? "I am waiting for an update on the items below. Reply directly to this email with an x between the brackets [x] for what is done. Replies are read in automatically, so please leave the references as they are."
    : !k.w ? "I need a quick update on the items below. Reply directly to this email, and write your answer right after Answer: under each item. Replies are read in automatically, so please leave the references as they are."
           : "Below are things I am waiting for from you, and " + q + ". Reply directly to this email with an x between the brackets [x] for what is done, and your answer right after Answer: under each question. Replies are read in automatically, so please leave the references as they are.",
    greet: them => "Hi " + them + ",",
    add: "Anything you want to add goes after Comment: under the item it is about.",
    bye: "Thanks,",
    waitHead: "Waiting for:", askHead: "Questions:",
    status: "What is the status?",
    comment: "Comment:", answer: "Answer:",
    reference: "Reference (leave as is):",
    // The lines under a line in the ask (#344).
    qW: "Question:", whyW: "Why:", askedW: "asked", heardW: "last heard", noneW: "no answer yet",
  },
  sv: {
    label: "Svenska",
    subject: askSubject("Väntar på", "Fråga om", "till", "svar"),
    qWords: ["en fråga", "några frågor"],
    intro: (k, file, q) =>
      !k.q ? "Jag väntar på en uppdatering om punkterna nedan. Bocka av i bifogade " + file + " och skicka den, eller svara direkt på det här mejlet med ett x mellan hakparenteserna [x] för det som är klart. Svaren läses in automatiskt, så låt referenserna stå kvar."
    : !k.w ? "Jag behöver en snabb uppdatering om punkterna nedan. Fyll i bifogade " + file + " och skicka den, eller svara direkt på det här mejlet och skriv ditt svar direkt efter Svar: under varje punkt. Svaren läses in automatiskt, så låt referenserna stå kvar."
           : "Nedan är det jag väntar på från dig, och " + q + ". Fyll i bifogade " + file +
             " och skicka den, eller svara direkt på det här mejlet: ett x mellan hakparenteserna [x] för det som är klart, och ditt svar direkt efter Svar: under varje fråga. Svaren läses in automatiskt, så låt referenserna stå kvar.",
    // Without the sheet: the same, answered by a plain reply.
    mail: (k, q) =>
      !k.q ? "Jag väntar på en uppdatering om punkterna nedan. Svara direkt på det här mejlet med ett x mellan hakparenteserna [x] för det som är klart. Svaren läses in automatiskt, så låt referenserna stå kvar."
    : !k.w ? "Jag behöver en snabb uppdatering om punkterna nedan. Svara direkt på det här mejlet, och skriv ditt svar direkt efter Svar: under varje punkt. Svaren läses in automatiskt, så låt referenserna stå kvar."
           : "Nedan är det jag väntar på från dig, och " + q + ". Svara direkt på det här mejlet med ett x mellan hakparenteserna [x] för det som är klart, och ditt svar direkt efter Svar: under varje fråga. Svaren läses in automatiskt, så låt referenserna stå kvar.",
    greet: them => "Hej " + them + ",",
    add: "Vill du lägga till något, skriv det efter Kommentar: under punkten det gäller.",
    bye: "Tack,",
    waitHead: "Väntar på:", askHead: "Frågor:",
    status: "Hur går det med det?",
    comment: "Kommentar:", answer: "Svar:",
    reference: "Referens (ändra inte):",
    // The lines under a line in the ask (#344).
    qW: "Fråga:", whyW: "Varför:", askedW: "frågade", heardW: "senast hört", noneW: "inget svar än",
  },
  no: {
    label: "Norsk",
    subject: askSubject("Venter på", "Spørsmål om", "flere", "svar"),
    qWords: ["et spørsmål", "noen spørsmål"],
    intro: (k, file, q) =>
      !k.q ? "Jeg venter på en oppdatering på punktene under. Huk av i vedlagte " + file + " og send det inn, eller svar direkte på denne e-posten med en x mellom klammene [x] for det som er gjort. Svarene leses inn automatisk, så la referansene stå."
    : !k.w ? "Jeg trenger en rask oppdatering på punktene under. Fyll inn i vedlagte " + file + " og send det inn, eller svar direkte på denne e-posten og skriv svaret ditt rett etter Svar: under hvert punkt. Svarene leses inn automatisk, så la referansene stå."
           : "Under er det jeg venter på fra deg, og " + q + ". Fyll inn i vedlagte " + file +
             " og send det inn, eller svar direkte på denne e-posten: en x mellom klammene [x] for det som er gjort, og svaret ditt rett etter Svar: under hvert spørsmål. Svarene leses inn automatisk, så la referansene stå.",
    // Without the sheet: the same, answered by a plain reply.
    mail: (k, q) =>
      !k.q ? "Jeg venter på en oppdatering på punktene under. Svar direkte på denne e-posten med en x mellom klammene [x] for det som er gjort. Svarene leses inn automatisk, så la referansene stå."
    : !k.w ? "Jeg trenger en rask oppdatering på punktene under. Svar direkte på denne e-posten, og skriv svaret ditt rett etter Svar: under hvert punkt. Svarene leses inn automatisk, så la referansene stå."
           : "Under er det jeg venter på fra deg, og " + q + ". Svar direkte på denne e-posten med en x mellom klammene [x] for det som er gjort, og svaret ditt rett etter Svar: under hvert spørsmål. Svarene leses inn automatisk, så la referansene stå.",
    greet: them => "Hei " + them + ",",
    add: "Har du noe å legge til, skriv det etter Kommentar: under punktet det gjelder.",
    bye: "Takk,",
    waitHead: "Venter på:", askHead: "Spørsmål:",
    status: "Hva er status?",
    comment: "Kommentar:", answer: "Svar:",
    reference: "Referanse (ikke endre):",
    // The lines under a line in the ask (#344).
    qW: "Spørsmål:", whyW: "Hvorfor:", askedW: "spurt", heardW: "sist hørt", noneW: "ikke svart ennå",
  },
  da: {
    label: "Dansk",
    subject: askSubject("Venter på", "Spørgsmål om", "mere", "svar"),
    qWords: ["et spørgsmål", "nogle spørgsmål"],
    intro: (k, file, q) =>
      !k.q ? "Jeg venter på en opdatering på punkterne nedenfor. Sæt kryds i den vedhæftede " + file + " og send den, eller svar direkte på denne mail med et x mellem klammerne [x] for det, der er klaret. Svarene læses ind automatisk, så lad referencerne stå."
    : !k.w ? "Jeg har brug for en hurtig opdatering på punkterne nedenfor. Udfyld den vedhæftede " + file + " og send den, eller svar direkte på denne mail og skriv dit svar lige efter Svar: under hvert punkt. Svarene læses ind automatisk, så lad referencerne stå."
           : "Nedenfor er det, jeg venter på fra dig, og " + q + ". Udfyld den vedhæftede " + file +
             " og send den, eller svar direkte på denne mail: et x mellem klammerne [x] for det, der er klaret, og dit svar lige efter Svar: under hvert spørgsmål. Svarene læses ind automatisk, så lad referencerne stå.",
    // Without the sheet: the same, answered by a plain reply.
    mail: (k, q) =>
      !k.q ? "Jeg venter på en opdatering på punkterne nedenfor. Svar direkte på denne mail med et x mellem klammerne [x] for det, der er klaret. Svarene læses ind automatisk, så lad referencerne stå."
    : !k.w ? "Jeg har brug for en hurtig opdatering på punkterne nedenfor. Svar direkte på denne mail, og skriv dit svar lige efter Svar: under hvert punkt. Svarene læses ind automatisk, så lad referencerne stå."
           : "Nedenfor er det, jeg venter på fra dig, og " + q + ". Svar direkte på denne mail med et x mellem klammerne [x] for det, der er klaret, og dit svar lige efter Svar: under hvert spørgsmål. Svarene læses ind automatisk, så lad referencerne stå.",
    greet: them => "Hej " + them + ",",
    add: "Har du noget at tilføje, så skriv det efter Kommentar: under det punkt, det drejer sig om.",
    bye: "Tak,",
    waitHead: "Venter på:", askHead: "Spørgsmål:",
    status: "Hvad er status?",
    comment: "Kommentar:", answer: "Svar:",
    reference: "Reference (rør ikke):",
    // The lines under a line in the ask (#344).
    qW: "Spørgsmål:", whyW: "Hvorfor:", askedW: "spurgt", heardW: "sidst hørt", noneW: "intet svar endnu",
  },
  de: {
    label: "Deutsch",
    subject: askSubject("Warte auf", "Frage zu", "weitere", "Antwort"),
    qWords: ["eine Frage", "ein paar Fragen"],
    intro: (k, file, q) =>
      !k.q ? "Ich warte auf ein Update zu den Punkten unten. Hake sie in der angehängten Datei " + file + " ab und schick sie zurück, oder antworte direkt auf diese E-Mail mit einem x zwischen den Klammern [x] für das, was erledigt ist. Die Antworten werden automatisch eingelesen, lass die Referenzen also bitte stehen."
    : !k.w ? "Ich brauche ein kurzes Update zu den Punkten unten. Füll die angehängte Datei " + file + " aus und schick sie zurück, oder antworte direkt auf diese E-Mail und schreib deine Antwort direkt nach Antwort: unter jeden Punkt. Die Antworten werden automatisch eingelesen, lass die Referenzen also bitte stehen."
           : "Unten steht, worauf ich von dir warte, und " + q + ". Füll die angehängte Datei " + file +
             " aus und schick sie zurück, oder antworte direkt auf diese E-Mail: ein x zwischen den Klammern [x] für das, was erledigt ist, und deine Antwort direkt nach Antwort: unter jeder Frage. Die Antworten werden automatisch eingelesen, lass die Referenzen also bitte stehen.",
    // Without the sheet: the same, answered by a plain reply.
    mail: (k, q) =>
      !k.q ? "Ich warte auf ein Update zu den Punkten unten. Antworte direkt auf diese E-Mail mit einem x zwischen den Klammern [x] für das, was erledigt ist. Die Antworten werden automatisch eingelesen, lass die Referenzen also bitte stehen."
    : !k.w ? "Ich brauche ein kurzes Update zu den Punkten unten. Antworte direkt auf diese E-Mail und schreib deine Antwort direkt nach Antwort: unter jeden Punkt. Die Antworten werden automatisch eingelesen, lass die Referenzen also bitte stehen."
           : "Unten steht, worauf ich von dir warte, und " + q + ". Antworte direkt auf diese E-Mail mit einem x zwischen den Klammern [x] für das, was erledigt ist, und deiner Antwort direkt nach Antwort: unter jeder Frage. Die Antworten werden automatisch eingelesen, lass die Referenzen also bitte stehen.",
    greet: them => "Hallo " + them + ",",
    add: "Möchtest du etwas ergänzen, schreib es nach Kommentar: unter den Punkt, um den es geht.",
    bye: "Danke,",
    waitHead: "Warte auf:", askHead: "Fragen:",
    status: "Wie ist der Stand?",
    comment: "Kommentar:", answer: "Antwort:",
    reference: "Referenz (nicht ändern):",
    // The lines under a line in the ask (#344).
    qW: "Frage:", whyW: "Warum:", askedW: "gefragt", heardW: "zuletzt gehört", noneW: "noch keine Antwort",
  },
};
const askQWords = (t, n) => t.qWords[n === 1 ? 0 : 1];
/* The headings between the two lists, in every language. The importer steps over them. */
const ASK_SECTION_RE = new RegExp("^\\s*(?:" + [...new Set(Object.values(ASK_NOTE)
  .flatMap(t => [t.waitHead, t.askHead]).map(h => h.replace(/:$/, "")))].join("|") + "):\\s*$", "i");
/* ---------- personalized text ----------
   The words around the list are yours to change, or to write in a language
   the app does not speak: pages/8/Update note.md, in Settings. Until
   you edit it the app uses the standard text, so nothing is written into a
   shared folder just for looking, like the weekly review.

   A top line names a part, the lines under it are its text. %name% is their
   first name, %file% the sheet, %me% you, %count% how many lines the part is
   about, %questions% "a question" or "a few questions". {one|more} picks the
   left side for one and the right for more: in Waiting for it counts what you
   wait for, everywhere else the questions. What the importer reads (the boxes,
   Comment:, Reference: and the --- fences) stays as it is, in the language the
   page was made from (base::), so their answer still finds its way home. */
const ASK_OWN_PATH = join(DIRS.lists, "Update note.md");
/* The email: parts are the formatted mail's words, the others the plain
   text's (Copy text, Teams, Plain-text mail and the sheet). */
const ASK_OWN_PARTS = [["greeting", "greet"],
  ["email: waiting for", "mw"], ["email: questions", "mq"], ["email: both", "mboth"], ["email: help", "mhelp"],
  ["waiting for", "w"], ["questions", "q"], ["both", "both"], ["comment", "add"], ["sign-off", "bye"]];
const askOwn = () => PREF.get("askLang", "") === "own";
const askLang = () => {
  const code = askOwn()
    ? (V.pages.has(ASK_OWN_PATH) ? trim(getPage(ASK_OWN_PATH).props?.base || "") : PREF.get("askLangBase", ""))
    : PREF.get("askLang", "");
  return ASK_NOTE[code] ? code : "en";
};
