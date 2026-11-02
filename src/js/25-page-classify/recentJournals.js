/* Journal files from the last N days that actually exist -- EVERYONE's, not
   just mine. A task somebody wrote in their own day page is still the team's
   task, so it belongs in the shared lists; whose page it came from is carried
   along for display. */
function recentJournals(days = CFG.journalScanDays) {
  const from = shiftISO(todayISO(), -(days - 1));
  const out = [];
  for (const path of V.pages.keys()) {
    if (!isJournalPath(path)) continue;
    // A week page counts from its Monday.
    const date = journalDate(path);
    if (!date || date < from) continue;
    out.push(path);
  }
  // Mine first, then the rest, newest first within each. Whose a page is gets
  // worked out once per page, not once per comparison.
  const mine = new Map(out.map(p => [p, myJournal(p)]));
  return out.sort((a, b) => (mine.get(b) - mine.get(a)) || baseName(b).localeCompare(baseName(a)));
}
