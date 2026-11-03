/* ---------- a big folder, read in two goes ----------
   An area with years of day pages took minutes to open on a phone, and
   nothing showed until the last file was read. So the first read is what the
   day needs: today's journal alone, the settings, lists and horizons. Projects,
   people, contexts and organisations come in by file name only, as empty
   pages, so links, pickers and lists have them. The rest is read behind your
   back and replaces them, in the order the day is planned from: yesterday back
   to a month, the active projects, contexts, people, then organisations, each
   on screen as soon as it is in. The rest follows, newest day first (#181).

   An empty stand-in must never reach the disk: doFlush() leaves them alone,
   and what was done to one while it loaded gives way to its file. */
const STUB_DIRS = [DIRS.cancelled, DIRS.completed, DIRS.active, DIRS.someday, DIRS.waiting,
                   DIRS.people, DIRS.contexts, DIRS.orgs];
const STUB_PAGES = new WeakSet();
const isStubPath = p => /\.md$/i.test(p) && STUB_DIRS.some(d => p.startsWith(d + "/"));
const stillLoading = (rec, path) =>
  !!rec.stubs && (rec.stubs.has(path) || STUB_PAGES.has(rec.pages.get(path)));

/* What of the rest comes in first (see restRank): a month of days, then the
   active projects, contexts, people and organisations, one after the other.
   Each is drawn as soon as it is in. Until then the four are there by file
   name only, so links, pickers and lists have them. */
const SHOWN_RANKS = 5;               // ranks below this are laid in and shown as each is in
const SHOWN_DAYS = 30;               // how far back the days after today's are read before the rest
/* A stand-in knows nothing: no outcome, no next action. What looks at a
   project's lines to find fault leaves it be until its file is in. */
const isStandIn = path => STUB_PAGES.has(getPage(path));
