/* The name of a place, for the arrow that goes there. */
function navWhere(snap) {
  if (!snap) return "";
  if (snap.view === "page" && snap.pagePath) return pageTitle(snap.pagePath);
  if (snap.view === "help" && HELP[snap.helpTopic]) return "Help: " + HELP[snap.helpTopic].title;
  return VIEW_TITLE[snap.view] || snap.view || "Journal";
}
