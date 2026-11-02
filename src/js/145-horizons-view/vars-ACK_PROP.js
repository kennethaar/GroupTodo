/* ============================================================
   THE UPDATE MAIL -- one mail for asking and for telling (#159)
   The mail is copied as formatted text and pasted into any mail program:
   no attachment to open, no server, no account. Each task in it is numbered,
   and each action is a mailto: link that opens a short reply to you, already
   saying which task it is about. A reply typed by hand uses the same rule, a
   number and then words, "2: next week" or "1 done", and the reference line
   at the bottom, which comes back in the quoted original, says which task
   each number is. docs/update-mail-mockup.html is the drawing it was made from.

   Outlook keeps only inline styles on a paste, and its dark mode turns light
   fills grey and dark text white. So: tables and inline styles, no fill
   behind any text, colours that read on white and on near-black, and the one
   filled cell is the Got it button, whose text is white anyway. Outlook
   ignores padding on a link, so the button's padding is on its cell.
   ============================================================ */
const ACK_PROP = "acknowledged";
const ackedDays = b => { const d = (trim(blockProp(b, ACK_PROP) || "").match(/\d{4}-\d{2}-\d{2}/) || [])[0]; return d ? dateDiffDays(d, todayISO()) : null; };
const MAIL_COLOR = {DONE: "#1f9255", DOING: "#2a7ae2", WAIT: "#c07a12", TODO: "#7b8794", CANCELLED: "#c8504a",
  wait: "#c07a12", question: "#2a7ae2"};
/* What the footer of a reply says, read back by parseNumberedReply: "2: ...",
   "1 done: ...", "Got it". These stay English in every language, as the
   reference does, so a reply reads the same whatever language the mail was in. */
const MAIL_GOT_IT = "Got it";
const MAIL_WORDS = {
  en: {
    askAbout: "Ask about this ›", markDone: "✓ Mark as done", writeAbout: "Write about this ›", answer: "Answer this ›",
    gotIt: "✓ Got it, thanks", gotItSaid: "Got it, thanks.",
    waitingFor: "Waiting for", question: "Question", open: n => "open " + n + " days",
    reQuestion: t => 'Question about "' + t + '"', reDone: t => 'Done: "' + t + '"', reAbout: t => 'About "' + t + '"',
    reAnswer: t => 'Answer: "' + t + '"',
    intro: n => "Here is a short update on " + (n === 1 ? "the task" : "the " + n + " tasks") + " I said I would get back to you about.",
    introAsk: (w, q) => !w ? (q === 1 ? "I have a quick question for you." : "I have " + q + " quick questions for you.")
      : "I am waiting for an update on the items below" + (q ? ", and I have " + (q === 1 ? "a question" : q + " questions") : "") + ".",
    helpAck: "One click confirms the lot.",
    help: "Ask about this opens a reply about that task alone. " +
      "Or just reply, with the number of the task: 2: can we go with the cheaper one?",
    helpAsk: "Each link opens a short reply: write a line if you like, and send. Or just reply, with the number: 1 done, or 2: next week.",
    paste: "[ Paste the GroupToDo update here: select this line and press Ctrl+V ]",
  },
  sv: {
    askAbout: "Fråga om detta ›", markDone: "✓ Markera som klar", writeAbout: "Skriv om detta ›", answer: "Svara på detta ›",
    gotIt: "✓ Uppfattat, tack", gotItSaid: "Uppfattat, tack.",
    waitingFor: "Väntar på", question: "Fråga", open: n => "öppen " + n + " dagar",
    reQuestion: t => 'Fråga om "' + t + '"', reDone: t => 'Klart: "' + t + '"', reAbout: t => 'Om "' + t + '"',
    reAnswer: t => 'Svar: "' + t + '"',
    intro: n => "Här är en kort uppdatering om " + (n === 1 ? "uppgiften" : "de " + n + " uppgifterna") + " jag lovade att återkomma om.",
    introAsk: (w, q) => !w ? (q === 1 ? "Jag har en snabb fråga till dig." : "Jag har " + q + " snabba frågor till dig.")
      : "Jag väntar på en uppdatering om punkterna nedan" + (q ? ", och jag har " + (q === 1 ? "en fråga" : q + " frågor") : "") + ".",
    helpAck: "Ett klick bekräftar alltihop.",
    help: "Fråga om detta öppnar ett svar om just den uppgiften. " +
      "Eller svara bara, med uppgiftens nummer: 2: kan vi ta den billigare?",
    helpAsk: "Varje länk öppnar ett kort svar: skriv en rad om du vill, och skicka. Eller svara bara, med numret: 1 klar, eller 2: nästa vecka.",
    paste: "[ Klistra in GroupToDo-uppdateringen här: markera raden och tryck Ctrl+V ]",
  },
  no: {
    askAbout: "Spør om dette ›", markDone: "✓ Merk som ferdig", writeAbout: "Skriv om dette ›", answer: "Svar på dette ›",
    gotIt: "✓ Mottatt, takk", gotItSaid: "Mottatt, takk.",
    waitingFor: "Venter på", question: "Spørsmål", open: n => "åpen " + n + " dager",
    reQuestion: t => 'Spørsmål om "' + t + '"', reDone: t => 'Ferdig: "' + t + '"', reAbout: t => 'Om "' + t + '"',
    reAnswer: t => 'Svar: "' + t + '"',
    intro: n => "Her er en kort oppdatering på " + (n === 1 ? "oppgaven" : "de " + n + " oppgavene") + " jeg lovet å komme tilbake til deg om.",
    introAsk: (w, q) => !w ? (q === 1 ? "Jeg har et kjapt spørsmål til deg." : "Jeg har " + q + " kjappe spørsmål til deg.")
      : "Jeg venter på en oppdatering på punktene under" + (q ? ", og jeg har " + (q === 1 ? "et spørsmål" : q + " spørsmål") : "") + ".",
    helpAck: "Ett klikk bekrefter alt.",
    help: "Spør om dette åpner et svar om akkurat den oppgaven. " +
      "Eller bare svar, med nummeret på oppgaven: 2: kan vi ta den billigste?",
    helpAsk: "Hver lenke åpner et kort svar: skriv en linje om du vil, og send. Eller bare svar, med nummeret: 1 ferdig, eller 2: neste uke.",
    paste: "[ Lim inn GroupToDo-oppdateringen her: merk linjen og trykk Ctrl+V ]",
  },
  da: {
    askAbout: "Spørg om dette ›", markDone: "✓ Markér som færdig", writeAbout: "Skriv om dette ›", answer: "Svar på dette ›",
    gotIt: "✓ Modtaget, tak", gotItSaid: "Modtaget, tak.",
    waitingFor: "Venter på", question: "Spørgsmål", open: n => "åben " + n + " dage",
    reQuestion: t => 'Spørgsmål om "' + t + '"', reDone: t => 'Færdig: "' + t + '"', reAbout: t => 'Om "' + t + '"',
    reAnswer: t => 'Svar: "' + t + '"',
    intro: n => "Her er en kort opdatering på " + (n === 1 ? "opgaven" : "de " + n + " opgaver") + ", jeg lovede at vende tilbage om.",
    introAsk: (w, q) => !w ? (q === 1 ? "Jeg har et hurtigt spørgsmål til dig." : "Jeg har " + q + " hurtige spørgsmål til dig.")
      : "Jeg venter på en opdatering på punkterne nedenfor" + (q ? ", og jeg har " + (q === 1 ? "et spørgsmål" : q + " spørgsmål") : "") + ".",
    helpAck: "Ét klik bekræfter det hele.",
    help: "Spørg om dette åbner et svar om netop den opgave. " +
      "Eller svar bare, med opgavens nummer: 2: kan vi tage den billigste?",
    helpAsk: "Hvert link åbner et kort svar: skriv en linje, hvis du vil, og send. Eller svar bare, med nummeret: 1 færdig, eller 2: næste uge.",
    paste: "[ Indsæt GroupToDo-opdateringen her: markér linjen og tryk Ctrl+V ]",
  },
  de: {
    askAbout: "Dazu fragen ›", markDone: "✓ Als erledigt melden", writeAbout: "Dazu schreiben ›", answer: "Darauf antworten ›",
    gotIt: "✓ Erhalten, danke", gotItSaid: "Erhalten, danke.",
    waitingFor: "Warte auf", question: "Frage", open: n => "seit " + n + " Tagen offen",
    reQuestion: t => 'Frage zu "' + t + '"', reDone: t => 'Erledigt: "' + t + '"', reAbout: t => 'Zu "' + t + '"',
    reAnswer: t => 'Antwort: "' + t + '"',
    intro: n => "Hier ein kurzes Update zu " + (n === 1 ? "der Aufgabe" : "den " + n + " Aufgaben") + ", zu denen ich mich melden wollte.",
    introAsk: (w, q) => !w ? (q === 1 ? "Ich habe eine kurze Frage an dich." : "Ich habe " + q + " kurze Fragen an dich.")
      : "Ich warte auf ein Update zu den Punkten unten" + (q ? ", und ich habe " + (q === 1 ? "eine Frage" : q + " Fragen") : "") + ".",
    helpAck: "Ein Klick bestätigt alles.",
    help: "Dazu fragen öffnet eine Antwort nur zu dieser Aufgabe. " +
      "Oder antworte einfach, mit der Nummer der Aufgabe: 2: können wir die günstigere nehmen?",
    helpAsk: "Jeder Link öffnet eine kurze Antwort: schreib eine Zeile, wenn du willst, und sende sie. Oder antworte einfach, mit der Nummer: 1 erledigt, oder 2: nächste Woche.",
    paste: "[ GroupToDo-Update hier einfügen: Zeile markieren und Strg+V drücken ]",
  },
};
const mailWords = () => MAIL_WORDS[askLang()] || MAIL_WORDS.en;
const mailCut = (s, n = 80) => s.length > n ? s.slice(0, n - 1) + "…" : s;
const mailEsc = s => String(s).replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]));
