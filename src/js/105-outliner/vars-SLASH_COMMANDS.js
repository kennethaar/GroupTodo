/* ---------- the slash menu ----------
   A slash at the start of a word, on a line in the outline, lists what can be
   done to the line by name: "/wait", "/due", "/ctx". It is the line menu and
   the state badge, reached without the mouse and without remembering which
   Alt key is which. The words in English and Norwegian both find a command,
   so "/frist" is the due date and "/venter" is waiting for. A slash after a
   letter -- 24/9, and/or, http:// -- is text, and so is one inside [[ ]]. */
const SLASH_COMMANDS = [
  {id: "TODO",      title: "Todo",            detail: "a task to do",          kw: ["todo", "task", "oppgave", "gjøre"]},
  {id: "DOING",     title: "Doing",           detail: "started on it",         kw: ["doing", "started", "now", "pågår", "gang"]},
  {id: "WAIT",      title: "Waiting for",     detail: "somebody else has it",  kw: ["wait", "waiting", "venter"]},
  {id: "DONE",      title: "Done",            detail: "finished",              kw: ["done", "finished", "ferdig"]},
  {id: "CANCELLED", title: "Cancelled",       detail: "dropped on purpose",    kw: ["cancel", "cancelled", "drop", "droppet", "avbrutt"]},
  {id: "due",       title: "Due date",        detail: "when it is for",        kw: ["due", "date", "deadline", "scheduled", "frist", "dato", "planlagt"]},
  {id: "ctx",       title: "Context",         detail: "where you can do it",   kw: ["context", "ctx", "where", "kontekst"]},
  {id: "proj",      title: "Project",         detail: "what it belongs to",    kw: ["project", "prosjekt"]},
  {id: "rep",       title: "Repeat",          detail: "comes back when done",  kw: ["repeat", "recurring", "gjenta"]},
  {id: "meet",      title: "Meeting",         detail: "attendees and agenda",  kw: ["meeting", "møte"]},
  {id: "in",        title: "Check in",        detail: "somebody arrived: who, project, time", kw: ["in", "arrive", "checkin", "inn", "kom", "ankom"]},
  {id: "out",       title: "Check out",       detail: "somebody left: the time out",          kw: ["out", "leave", "checkout", "ut", "gikk", "dro"]},
  {id: "query",     title: "Live list",       detail: "lines that match, kept up to date", kw: ["query", "list", "filter", "spørring", "liste", "filter"]},
  {id: "embed",     title: "Show a page here", detail: "another page, live",   kw: ["embed", "include", "show", "vis", "bygg"]},
  {id: "run",       title: "Run a routine or list", detail: "its steps under this line", kw: ["run", "routine", "checklist", "template", "kjør", "rutine", "sjekkliste", "mal"]},
  {id: "inform",    title: "Send an update",  detail: "tell somebody where it stands", kw: ["inform", "update", "tell", "report", "oppdater", "orienter", "informer"]},
  {id: "more",      title: "Open in the side panel", detail: "dates, chat, history", kw: ["open", "side", "more", "details", "panel", "mer", "åpne"]},
  {id: "ttype",     title: "Task type",       detail: "stages of its own",     kw: ["type", "kind", "stages", "slag"]},
  // Only in an area with a book (#244).
  {id: "darling",   title: "Cut to darlings",  detail: "the sentence here, or at the start the whole line", kw: ["darling", "darlings", "cut", "kill", "stryk"], when: () => hasBook()},
];
/* Every task type's stages are commands too, found by the stage's words or the
   type's: "/deliv" and "/purchase" both find Awaiting delivery. */
const STAGE_CMD = "stage\u0001";
