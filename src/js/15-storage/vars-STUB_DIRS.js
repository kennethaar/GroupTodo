/* ---------- a big folder, read in two goes ----------
   An area with years of day pages took minutes to open on a phone, and
   nothing showed until the last file was read. So the first read is what the
   day needs: today's journal alone, the settings, lists, horizons, areas and
   goals. Every other page under pages/ -- projects, people, contexts,
   organisations, notes, mail, reviews -- comes in by file name only, as an
   empty page, so links, pickers and lists have them. The rest is read behind
   your back and replaces them, in the order the day is planned from:
   yesterday back to a month, the active projects, contexts, people, then
   organisations, each on screen as soon as it is in. The rest follows, newest
   day first (#181).

   An empty stand-in must never reach the disk: doFlush() leaves them alone,
   and what was done to one while it loaded gives way to its file. */
const FIRST_DIRS = [join(PAGES, "_"), DIRS.lists, DIRS.areas, DIRS.goals, DIRS.verbs, DIRS.templates];
/* Not even listed before the first draw, where the folder has been read in
   full on this device before: the day pages, and the folders read last.
   Their names come in behind the day (readStaged). */
const LATE_DIRS = [DIRS.completed, DIRS.cancelled, DIRS.zettel, DIRS.mail, DIRS.reviews];
const listedLate = p => isJournalPath(p) || LATE_DIRS.some(d => p.startsWith(d + "/"));
const STUB_PAGES = new WeakSet();
/* Loose pages straight in pages/ are notes and wait like them: hundreds of
   them held a phone's first draw for two minutes. Only the settings and the
   old horizon pages there are needed first. */
const isStubPath = p => /\.md$/i.test(p) && p.startsWith(PAGES + "/") &&
  !FIRST_DIRS.some(d => p.startsWith(d + "/")) && p !== SETTINGS_PATH && !HORIZONS_LEGACY.includes(p);
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
