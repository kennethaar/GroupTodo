/* "Out of this project" is a refile to today's journal: the inbox is where an
   action with no home belongs, and deleting the action is not what was asked. */
function unfileFromProject(path, block) {
  refileBlock(path, block, ensureJournal(todayISO()));
}
