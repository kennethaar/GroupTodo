/* Actions on your own day pages that nothing holds: no project line above
   them, no responsibility, no checklist. Due, overdue or waiting, they are
   still loose; a colleague's day page is theirs to file. The nudge, the
   review's checklist and its loose actions pass all count these. */
function looseActions(acts = leafActions()) {
  const me = journalOwner();
  return acts.filter(a => isJournalPath(a.path) && !a.project && !a.area && !a.checklist && !a.tourStep
    && !(a.owner && a.owner !== me));
}
