/* ============================================================
   SENDING AN UPDATE -- the check-in sheet the other way round
   Asking is for what somebody owes you. This is for what you owe them: a
   task of yours that names a colleague, a client, a supplier, where they are
   waiting to hear how it goes. Each line goes with where it stands and a
   word from you, and what was said is kept on the task: informed:: on the
   line, and "Told ..." in its thread, so "did you tell them?" has an answer
   a month later. As with the sheet, only the lines you tick go out.
   ============================================================ */
const INFORMED_PROP = "informed";
const informedAt   = b => (trim(blockProp(b, INFORMED_PROP) || "").match(/\d{4}-\d{2}-\d{2}/) || [])[0] || null;
const informedDays = b => { const d = informedAt(b); return d ? dateDiffDays(d, todayISO()) : null; };
// The states as you see them in the dialog, and what the thread says.
const INFORM_STATES = [["TODO", "Not started"], ["DOING", "In progress"], ["WAIT", "Waiting"],
  ["DONE", "Done"], ["CANCELLED", "Cancelled"]];
const INFORM_NOTE = {
  en: {
    states: {TODO: "Not started", DOING: "In progress", WAIT: "Waiting", DONE: "Done", CANCELLED: "Cancelled"},
    subject: (first, n) => 'Update: "' + first + '"' + (n > 1 ? " + " + (n - 1) + " more" : ""),
    greet: them => "Hi " + them + ",",
    intro: n => n === 1 ? "A quick update on where this stands." : "A quick update on where these stand.",
    sheet: file => "The same is in the attached " + file + ", to keep.",
    projects: {"1": "Active", "3": "Waiting", "2": "Someday", "0": "Done", "-": "Cancelled", hold: "On hold"},
    lines: {next: "Next:", done: "Done:", late: "Late:", wait: "Waiting:"}, other: "Other",
    status: "Status:", bye: "Best regards,",
    title: "Where things stand, from {from}", hello: "Hi {first}",
    lede: "{from} is letting you know where things stand.", at: "As of {when}",
    tail: "This page is all there is: no account, nothing uploaded, nothing tracked. It shows only what {from} chose to tell you.",
  },
  sv: {
    states: {TODO: "Inte påbörjad", DOING: "Pågår", WAIT: "Väntar", DONE: "Klar", CANCELLED: "Avbruten"},
    subject: (first, n) => 'Uppdatering: "' + first + '"' + (n > 1 ? " + " + (n - 1) + " till" : ""),
    greet: them => "Hej " + them + ",",
    intro: n => n === 1 ? "En kort uppdatering om hur det går med det här." : "En kort uppdatering om hur det går med de här punkterna.",
    sheet: file => "Samma sak finns i bifogade " + file + ", att spara.",
    projects: {"1": "Aktiv", "3": "Väntar", "2": "Någon gång", "0": "Klar", "-": "Avbruten", hold: "Pausad"},
    lines: {next: "Nästa:", done: "Klart:", late: "Försenat:", wait: "Väntar:"}, other: "Övrigt",
    status: "Status:", bye: "Hälsningar,",
    title: "Läget, från {from}", hello: "Hej {first}",
    lede: "{from} berättar hur det går.", at: "Per {when}",
    tail: "Den här sidan är allt som finns: inget konto, inget laddas upp, inget spåras. Den visar bara det {from} valde att berätta.",
  },
  no: {
    states: {TODO: "Ikke startet", DOING: "Pågår", WAIT: "Venter", DONE: "Ferdig", CANCELLED: "Avbrutt"},
    subject: (first, n) => 'Oppdatering: "' + first + '"' + (n > 1 ? " + " + (n - 1) + " flere" : ""),
    greet: them => "Hei " + them + ",",
    intro: n => n === 1 ? "En kort oppdatering på hvor dette står." : "En kort oppdatering på hvor disse punktene står.",
    sheet: file => "Det samme står i vedlagte " + file + ", til å ta vare på.",
    projects: {"1": "Aktiv", "3": "Venter", "2": "En gang", "0": "Ferdig", "-": "Avbrutt", hold: "På vent"},
    lines: {next: "Neste:", done: "Ferdig:", late: "Forsinket:", wait: "Venter:"}, other: "Annet",
    status: "Status:", bye: "Hilsen,",
    title: "Status fra {from}", hello: "Hei {first}",
    lede: "{from} gir deg en oppdatering på hvor ting står.", at: "Per {when}",
    tail: "Denne siden er alt som finnes: ingen konto, ingenting lastes opp, ingenting spores. Den viser bare det {from} valgte å fortelle deg.",
  },
  da: {
    states: {TODO: "Ikke startet", DOING: "I gang", WAIT: "Venter", DONE: "Færdig", CANCELLED: "Annulleret"},
    subject: (first, n) => 'Opdatering: "' + first + '"' + (n > 1 ? " + " + (n - 1) + " mere" : ""),
    greet: them => "Hej " + them + ",",
    intro: n => n === 1 ? "En kort opdatering på, hvor det her står." : "En kort opdatering på, hvor disse punkter står.",
    sheet: file => "Det samme står i den vedhæftede " + file + ", til at gemme.",
    projects: {"1": "Aktiv", "3": "Venter", "2": "En dag", "0": "Færdig", "-": "Annulleret", hold: "På pause"},
    lines: {next: "Næste:", done: "Færdigt:", late: "Forsinket:", wait: "Venter:"}, other: "Andet",
    status: "Status:", bye: "Venlig hilsen,",
    title: "Status fra {from}", hello: "Hej {first}",
    lede: "{from} giver dig en opdatering på, hvor tingene står.", at: "Pr. {when}",
    tail: "Denne side er det hele: ingen konto, intet uploades, intet spores. Den viser kun det, {from} valgte at fortælle dig.",
  },
  de: {
    states: {TODO: "Nicht begonnen", DOING: "In Arbeit", WAIT: "Wartet", DONE: "Erledigt", CANCELLED: "Abgebrochen"},
    subject: (first, n) => 'Update: "' + first + '"' + (n > 1 ? " + " + (n - 1) + " weitere" : ""),
    greet: them => "Hallo " + them + ",",
    intro: n => n === 1 ? "Ein kurzes Update, wie es hier steht." : "Ein kurzes Update, wie diese Punkte stehen.",
    sheet: file => "Dasselbe steht in der angehängten Datei " + file + ", zum Aufheben.",
    projects: {"1": "Aktiv", "3": "Wartet", "2": "Irgendwann", "0": "Erledigt", "-": "Abgebrochen", hold: "Pausiert"},
    lines: {next: "Als Nächstes:", done: "Erledigt:", late: "Überfällig:", wait: "Wartet:"}, other: "Weiteres",
    status: "Status:", bye: "Viele Grüße,",
    title: "Stand der Dinge, von {from}", hello: "Hallo {first}",
    lede: "{from} sagt dir, wie die Dinge stehen.", at: "Stand: {when}",
    tail: "Diese Seite ist alles: kein Konto, nichts wird hochgeladen, nichts verfolgt. Sie zeigt nur, was {from} dir mitteilen wollte.",
  },
};
const informWords = () => INFORM_NOTE[askLang()] || INFORM_NOTE.en;

/* The words around the lines are yours too, as with the update note:
   pages/8/Inform note.md, used when Personalize text is picked. %name% is
   their first name, %me% you, %file% the sheet, %count% how many lines. */
const INFORM_OWN_PATH = join(DIRS.lists, "Inform note.md");
const INFORM_OWN_PARTS = [["greeting", "greet"],
  ["email: update", "mintro"], ["email: got it", "mack"], ["email: help", "mhelp"],
  ["update", "intro"], ["with the sheet", "sheet"], ["sign-off", "bye"]];
