/* ---------- a big folder, read in two goes ----------
   An area with years of day pages took minutes to open on a phone, and
   nothing showed until the last file was read. So the first read is what the
   day needs: today's journal and the three before it, the settings, lists
   and horizons. Projects, people, contexts and organisations come in by
   file name only, as empty pages, so links, pickers and lists have them.
   The rest is read behind your back and replaces them, in the order the day
   is planned from: the active projects alone first, then the week's day
   pages, people, contexts and organisations, each on screen as soon as it is
   in. The rest follows, newest day first (#181).

   An empty stand-in must never reach the disk: doFlush() leaves them alone,
   and what was done to one while it loaded gives way to its file. */
const STUB_DIRS = [DIRS.cancelled, DIRS.completed, DIRS.active, DIRS.someday, DIRS.waiting,
                   DIRS.people, DIRS.contexts, DIRS.orgs];
const STUB_PAGES = new WeakSet();
const isStubPath = p => /\.md$/i.test(p) && STUB_DIRS.some(d => p.startsWith(d + "/"));
const stillLoading = (rec, path) =>
  !!rec.stubs && (rec.stubs.has(path) || STUB_PAGES.has(rec.pages.get(path)));

/* What of the rest comes in first. The active projects are read on their own
   and shown before anything else: Projects has its names and next actions
   while the week, people, contexts and organisations are still on their way.
   Those are rank 1, and shown as soon as they are in too. */
const SOON_DIRS = [DIRS.people, DIRS.contexts, DIRS.orgs];
const SHOWN_RANKS = 2;               // ranks below this are laid in and shown as each is in
