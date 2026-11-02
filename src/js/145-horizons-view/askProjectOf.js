/* What a line is about, the project its page is, for the parts above. A day
   page is no project: its date says nothing to them. */
function askProjectOf(a) {
  if (trim(a.project || "")) return trim(a.project);
  if (!a.path || isJournalPath(a.path)) return "";
  return inSpace(a.space, () => (V.pages.has(a.path) ? pageTitle(a.path) : baseName(a.path)));
}
