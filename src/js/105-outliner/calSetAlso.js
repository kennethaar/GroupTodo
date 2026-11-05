/* One calendar's meetings shown in, or taken out of, one more area, straight
   away. Returns what happened, for the caller to say. */
function calSetAlso(url_, n, on) {
  const feeds = calFeeds(), f = feeds.find(x => x.url === url_);
  if (!f) return "";
  f.also = on ? [...new Set([...(f.also || []), n])] : (f.also || []).filter(x => x !== n);
  setCalFeeds(feeds);
  const feed = calFeedId(f.url), name = f.label || calHost(f.url);
  if (on) {
    const r = routeCalendarMeetings(calHome(), feed, calAlso(f), ...calWindow(), n);
    return r.sent ? name + ": " + r.sent + (r.sent === 1 ? " meeting" : " meetings") + " now shown in " + n + "."
      : name + ": its meetings are shown in " + n + " from the next import.";
  }
  const k = unrouteCalendar(feed, n);
  return name + ": no longer shown in " + n + (k ? "; " + k + (k === 1 ? " meeting" : " meetings") + " taken off there" : "") + ".";
}
