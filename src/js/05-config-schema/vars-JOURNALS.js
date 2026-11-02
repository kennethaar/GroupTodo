/* ============================================================
   05_CONFIG_SCHEMA
   Port of: init.lua 05_CONFIG_SCHEMA
   Same vault shape as the Neovim config, with .md instead of .org:
     journals/YYYY-MM-DD.md
     pages/{_,0,1,2,3}/   project status directories
     pages/{c,p,o,z,m}/   contexts, people, orgs, zettel, emails
     pages/{templates,verbs}/
   ============================================================ */
const JOURNALS = "journals";
const PAGES    = "pages";
const DIRS = {
  journals : JOURNALS,
  pages    : PAGES,
  /* Cancelled used to live in pages/_/, which is also where the horizon pages
     live, so every project query had to filter horizons back out by hand and a
     cancelled project and your purpose shared one drawer. Cancelled is "-" now:
     struck out, and it keeps the rule that the folder name IS the status code.
     pages/_/ is horizons alone. migrateCancelled() moves old vaults. */
  cancelled: join(PAGES, "-"),
  completed: join(PAGES, "0"),
  active   : join(PAGES, "1"),
  someday  : join(PAGES, "2"),
  waiting  : join(PAGES, "3"),
  orgs     : join(PAGES, "o"),
  people   : join(PAGES, "p"),
  contexts : join(PAGES, "c"),
  /* Templates used to be a folder of their own, beside the checklists. They
     were never a different thing: both are a page you keep in order to pour it
     into another page later, and having two of them meant two places to look,
     two ways to make one, and a rule nobody could state about which to use.
     There is one folder now -- pages/8/, the lists -- and this is only the old
     address, kept so migrateTemplates() can find what is still at it. */
  templates: join(PAGES, "templates"),
  verbs    : join(PAGES, "verbs"),
  zettel   : join(PAGES, "z"),
  areas    : join(PAGES, "a"),   // H2: areas of focus, the standing responsibilities
  goals    : join(PAGES, "g"),   // H3: goals and objectives, 1-2 years
  lists    : join(PAGES, "8"),   // 8 = eternity: checklists you run again and again
  mail     : join(PAGES, "m"),   // emails pasted in, each with what came of it
  reviews  : join(PAGES, "r"),   // books, films, series and videos, and what you made of them
};
const TODO_STATES  = ["TODO", "DOING", "WAIT", "DONE", "CANCELLED"];
const OPEN_STATES  = {TODO:true, DOING:true, WAIT:true};
const openOf = list => list.filter(a => OPEN_STATES[a.state]);
const STATE_ALIAS  = {WAITING:"WAIT", CANCELED:"CANCELLED", NOW:"DOING", LATER:"TODO"};
const STATUS_DIRS  = {"-":DIRS.cancelled, "0":DIRS.completed, "1":DIRS.active, "2":DIRS.someday, "3":DIRS.waiting};
const STATUS_TEXT  = {
  "-": "- = cancelled",
  "0": "0 = completed",
  "1": "1 = active",
  "2": "2 = someday maybe",
  "3": "3 = waiting for 3rd party",
};
const STATUS_LABEL = {"-":"Cancelled", "0":"Completed", "1":"Active", "2":"Someday/Maybe", "3":"Waiting for"};
/* The vault's own order: - 0 1 2 3, then 8 for the checklists. */
const STATUS_ORDER = ["-", "0", "1", "2", "3"];
const PREFIX_DIR   = {"8":DIRS.lists,            // integer-like key, so pageRef finds it first
                      p:DIRS.people, c:DIRS.contexts, o:DIRS.orgs, z:DIRS.zettel,
                      a:DIRS.areas, g:DIRS.goals, m:DIRS.mail, r:DIRS.reviews,
                      _:join(PAGES, "_"),           // horizons: [[_/Purpose]], [[_/Vision]]
                      k:DIRS.lists};                // legacy: old [[k/...]] links still resolve

/* Tunables -- the GTD nudge thresholds (inline constants in init.lua). */
const CFG = {
  surfaceCount     : 3,      // oldest TODOs surfaced per context
  weedCount        : 3,      // stalest projects in morning weeding
  staleProjectDays : 180,    // "older than 6 months" warning
  reviewEveryDays  : 7,      // weekly review cadence
  waitFollowUpDays : 14,     // nudge to chase a WAIT item
  quietUntilTasks  : 6,      // simple mode: no GTD hygiene talk below this
  nudgeMax         : 4,      // chips on screen at once; the rest wait behind "more"
  nudgeSnoozeDays  : 7,      // a nudge you quieten stays quiet this long
  tipMinTasks      : 3,      // enough on the list for "some of these belong together"
  tipSnoozeDays    : 5,      // "not now" on a suggestion
  busyTasks        : 40,     // past this the length of the list is the problem
  busyProjectTodos : 12,     // one project carrying this much is really several
  undoStateMinutes : 5,      // grace period to cycle back without losing the dates
  weedMinProjects  : 5,      // weeding is for a garden, not a window box
  weedMinTodos     : 20,
  agendaDays       : 14,
  rowsPerPage      : 100,    // drawn at once; the rest wait behind "show more"
  groupsPerPage    : 100,    // project sections drawn at once
  boardPerColumn   : 100,    // cards in one board column
  boardPerPhone    : 12,     // and on a phone, where the columns are stacked
  graphNodes       : 200,    // pages the mind map starts from, best-connected first
  graphStep        : 500,    // pages the map draws at first, and how many more "Show more" adds
  plexTaskFan      : 12,     // todos hung off one page or todo in the mindmap
  journalScanDays  : 365,
  remindLeadMinutes: 10,     // a toast this long before a task's time; remind:: overrides
  contextPrompts   : [[12, 0, "lunchtime"], [17, 0, "after work"]],
};

/* A journal belongs to one person. It is the one page everybody writes to
   every single day, so sharing it is the fastest way to make a vault
   confusing: two people appending to the same day, each wondering which lines
   are theirs. Each person gets a folder instead, and what they put in it is
   still visible to everyone in the space.

   Before a name is set there is no folder to use, so the old flat path stays
   valid and migrateJournals() moves those files in once a name exists. */
/* Not slugify(): that falls back to "Untitled" for an empty string, which is
   right for a page with no title and wrong here -- it gave somebody who had
   not named themselves a journal folder called Untitled, which then never
   migrated because it looked like it already had an owner. No name must mean
   no folder. */
const slugPerson = n => trim(n || "")
  .replace(/[\u0000-\u001f/\\:*?"<>|]/g, "-")
  .replace(/\s+/g, " ")
  .slice(0, 40);
/* Whose folder "my" day pages are in, in the area being worked in. The name
   is set per area, so an area can know you by one name while your day pages
   sit under another of yours ("Kenneth" here, journals/Kenneth Aar/ on disk).
   When the folder for this area's name has no days and one of your other names
   has, that folder is yours: your pages are found where they are, not hidden
   behind an empty one. Kept per area until the page count changes. */
const JOWNER = new WeakMap();
const journalOwner = () => {
  const s = slugPerson(whoAmI());
  const pages = V.pages;
  if (!pages || !pages.size) return s;
  const hit = JOWNER.get(pages);
  if (hit && hit.s === s && hit.n === pages.size) return hit.owner;
  const has = dir => { const pre = join(JOURNALS, dir) + "/"; for (const p of pages.keys()) if (p.startsWith(pre)) return true; return false; };
  let owner = s;
  if (!s || !has(s)) {
    const alt = myNames().map(slugPerson).filter(n => n && n !== s && has(n));
    if (alt.length === 1) owner = alt[0];
  }
  JOWNER.set(pages, {s, n: pages.size, owner});
  return owner;
};
const journalPath = (date, owner) => {
  const who = owner === undefined ? journalOwner() : slugPerson(owner);
  const day = (date || todayISO()) + ".md";
  return who ? join(JOURNALS, who, day) : join(JOURNALS, day);
};
/* "" for an un-owned journal from before a name was set. */
const journalOwnerOf = path => {
  const rest = String(path).slice(JOURNALS.length + 1);
  const cut = rest.lastIndexOf("/");
  return cut === -1 ? "" : rest.slice(0, cut);
};
const myJournal = path => journalOwnerOf(path) === journalOwner();
/* A week page is a journal page named for its week, journals/<you>/2026-W44.md,
   for what belongs to the week and to no one day of it. */
const isWeekPath = path => isJournalPath(path) && WEEK_RE.test(baseName(path));
/* The day a journal page stands for: its own, or its week's Monday. */
const journalDate = path => {
  const b = baseName(path);
  return /^\d{4}-\d{2}-\d{2}$/.test(b) ? b : weekMonday(b);
};
const todayStamp  = () => "[[" + todayISO() + "]]";
