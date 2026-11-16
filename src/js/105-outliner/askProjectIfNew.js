/* A line on a day page that has just become an open task, with no project
   above it, asks for one (#401) -- typed, or made one from the toolbar on a phone. */
function askProjectIfNew(path, b, prev) {
  if (!prev && b.state && OPEN_STATES[b.state] && isJournalPath(path) && !lineProject(path, b)) ASK_PROJECT.id = b.id;
}
