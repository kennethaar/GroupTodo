/* Every journal there is, however old. The day window above is right for
   "what has been going on lately"; it is wrong for "what is still open",
   because a task written fourteen months ago is the one most worth seeing,
   not the one to drop off the list. */
const allJournals = () => recentJournals(100000);

/* Pages that are neither a project nor a day, but can still hold a task:
   a person, an org, a context, a note, an area, a goal, a horizon. Nothing
   stops you typing a TODO on one -- the app puts the outliner on every page --
   so the task lists have to look there too, or the task is only ever visible
   on the page you happened to write it on.

   The checklists in pages/8/ are left out on purpose: those are the list, not
   a run of it. Their steps become tasks when the list is poured into a day or
   a project. */
const looseTodoPages = () => allPages(p =>
  isPagePath(p) && !statusDirOf(p) && !p.startsWith(DIRS.lists + "/"));

/* archived:: true on a page puts it away without deleting it: an old note,
   a person you no longer work with, three years of imported Logseq days. Its
   open lines stop counting as things to do, it drops out of the done report,
   and search shows it last. It is still a page, still linked, still opens. */
const isArchived = path => /^(true|yes)$/i.test(trim(String(getPage(path)?.props?.archived || "")));
