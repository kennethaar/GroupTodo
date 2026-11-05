/* Meetings on your day pages from a calendar that is no longer listed: a
   removed link, an imported .ics file, or the same calendar added twice. A
   listed calendar is not offered, since its next fetch would put them back. */
function calOrphans() {
  const live = new Set(calFeeds().map(f => calFeedId(f.url)));
  return calImported().filter(g => !live.has(g.feed));
}
