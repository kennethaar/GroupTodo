function pageKind(path) {
  if (isJournalPath(path)) return "journal";
  if (isHorizonPage(path)) return "horizon";
  if (statusDirOf(path)) return "project";
  if (path.startsWith(DIRS.contexts  + "/")) return "context";
  if (path.startsWith(DIRS.people    + "/")) return "person";
  if (path.startsWith(DIRS.orgs      + "/")) return "org";
  if (path.startsWith(DIRS.zettel    + "/")) return "zettel";
  if (path.startsWith(DIRS.mail      + "/")) return "email";
  if (path.startsWith(DIRS.reviews   + "/")) return "review";
  if (path.startsWith(DIRS.areas     + "/")) return "area";
  if (path.startsWith(DIRS.goals     + "/")) return "goal";
  // A tracker's page is its settings and your notes, not a list you run.
  // The sidebar's page likewise (#238), and the book's (#240).
  if (isTrackerPage(path) || path === SIDEBAR_PATH || isBookPath(path) || path === DARLINGS_PATH) return "page";
  // Both folders answer "checklist": the old one empties on load, and until it
  // has, what is in it is a list like any other rather than a second species.
  if (path.startsWith(DIRS.lists     + "/")) return "checklist";
  if (path.startsWith(DIRS.templates + "/")) return "checklist";
  if (path.startsWith(DIRS.verbs     + "/")) return "verb";
  return "page";
}
