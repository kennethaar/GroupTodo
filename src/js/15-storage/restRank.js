/* The order the rest of a big folder is read in, and so shown in (#181):
   0  yesterday back to a month, and the days ahead
   1  the active projects      2  contexts      3  people      4  organisations
   5  waiting and someday      6  done, cancelled, notes, mail and reviews
   7  the older days
   Ranks below SHOWN_RANKS are laid in and drawn as each is in; until then
   the projects, contexts, people and organisations are there by file name. */
function restRank(p, monthAgo) {
  if (isJournalPath(p)) return dayOfPath(p) >= monthAgo ? 0 : 7;
  if (p.startsWith(DIRS.active + "/")) return 1;
  if (p.startsWith(DIRS.contexts + "/")) return 2;
  if (p.startsWith(DIRS.people + "/")) return 3;
  if (p.startsWith(DIRS.orgs + "/")) return 4;
  return [DIRS.waiting, DIRS.someday].some(d => p.startsWith(d + "/")) ? 5 : 6;
}
