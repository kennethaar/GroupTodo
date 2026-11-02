/* A vault bundle is itself a .md file, and people quite reasonably keep one in
   the folder they are syncing. Read as a page it would turn the whole vault
   into a single blob of text -- exactly the thing that is not wanted -- so it
   is recognised and left alone. */
const looksLikeBundle = text =>
  /<!--\s*gtd:(bundle|file)\b/.test(text.slice(0, 4000));

/* ---------- a guide in every folder ----------
   Somebody who opens the shared folder in Explorer meets folders called 0, 1,
   8, a, o and p, and nothing says what they are. So every folder carries one
   small file named for what its letter stands for -- "_o_for Organisations.md"
   -- that sorts to the top and says what goes there, how the folders work
   together, and how the app links names as you type. The app writes them and
   refreshes them when the wording changes; it never reads one as a page. */
const GUIDE_VERSION = 2;
const GUIDE_FOLDERS = [
  ["", "GroupToDo", "this folder", "One area of GroupToDo: everything in it is shared with whoever can open this folder. " +
    "Day pages live in journals/, everything else in pages/."],
  [JOURNALS, "journals", "Day pages", "One folder per person, one file per day, named by date: journals/<name>/2026-10-16.md. " +
    "This is today's page in your journal. Nobody types on anybody else's day, and everybody can read every day."],
  [PAGES, "pages", "Every page that is not a day", "Each subfolder is a kind of page, and the folder name is the first part of a link to it. " +
    "A page right here in pages/ is an ordinary page with no particular kind."],
  [DIRS.active, "1", "Active projects", "Projects you are working on now. A project is an outcome, not a topic: outcome:: on the page says what done looks like. " +
    "Link one as [[1/Name]], or type # and pick it."],
  [DIRS.waiting, "3", "Waiting-for projects", "Projects that cannot move until somebody else does something. They stay in Waiting for until it comes back."],
  [DIRS.someday, "2", "Someday or maybe", "Projects you might do, not now. The weekly review deals them out so they get a look once a week."],
  [DIRS.completed, "0", "Completed projects", "Finished projects. Kept, because the Report and the links still read them."],
  [DIRS.cancelled, "-", "Cancelled projects", "Projects you decided not to do. Kept for the record, struck out."],
  [DIRS.areas, "a", "Responsibilities", "Areas of focus you keep in good shape and never finish: Health, Finance, Customer support. " +
    "Projects point at one with area:: [[a/Name]]."],
  [DIRS.goals, "g", "Goals", "What you want to be true in a year or two. Projects and responsibilities can point at a goal."],
  [join(PAGES, "_"), "_", "Purpose and vision", "The top of the horizons: Purpose.md and Vision.md. One of each per area."],
  [DIRS.people, "p", "People", "One page per person: [[p/Alice Berg]]. A page with member:: true is somebody who uses GroupToDo in this area. " +
    "email:: on the page is where check-in sheets go. organisation:: [[o/Acme]] says where they work, which tells two people with one name apart: " +
    "p/Anna Berg - Acme and p/Anna Berg - Northwind."],
  [DIRS.orgs, "o", "Organisations", "Customers, suppliers and partners: [[o/Acme]]. A project or task that links one is that organisation's work, " +
    "which is what the Report groups by customer. Its page lists the people who work there and everything open that names it or them."],
  [DIRS.contexts, "c", "Contexts", "Where you are or what you need to do something: [[c/phone]], [[c/office]], [[c/errand]]. " +
    "Next can show one column per context."],
  [DIRS.lists, "8", "Routines and lists", "Checklists you run again and again, and templates for new projects. The weekly review is one of them. " +
    "8 is eternity: these never finish."],
  [DIRS.zettel, "z", "Notes", "Notes worth keeping that are not projects: ideas, references, meeting notes."],
  [DIRS.mail, "m", "Emails", "Emails pasted into the box at the top: who sent it, when, the words, and the answers that came back. " +
    "A task on the day it arrived links to it as [[m/Subject]]."],
  [DIRS.reviews, "r", "Reviews", "Books, films, series and videos you have been through: what it was, who made it, how good it was, and what you made of it."],
  [DIRS.verbs, "verbs", "Verbs", "The words a next action can start with (call, draft, buy), with their synonyms. Used to nudge a task towards something you can actually do."],
];
const guideFileName = (code, name) => "_" + code + "_for " + name + ".md";
const GUIDE_PATHS = new Set(GUIDE_FOLDERS.map(([dir, code, name]) => join(dir, guideFileName(code, name))));
const isGuidePath = path => GUIDE_PATHS.has(path) || /(^|\/)_[^/]+_for [^/]+\.md$/.test(path);
