/* The columns a sheet has, as [name, title]: the trackers, in the order the
   setting names them, else by name. */
function sheetKinds(S) {
  if (S.source) return [...new Set(sheetEntries(S).map(e => e.name))].sort((a, b) => a.localeCompare(b)).map(n => [n, n]);
  return sheetTrackers(S).map(n => [n, trackerTitle(n)]);
}
