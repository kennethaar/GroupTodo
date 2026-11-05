/* One calendar: who else sees it, where it comes from, and its own Sync and Remove. */
function drawCalendarSettings(url) {
  const f = calFeeds().find(x => x.url === url);
  if (!f) return drawCalendars();
  const feed = calFeedId(f.url), name = f.label || calHost(f.url);
  const at = calStamps(CAL_SYNCED_KEY)[feed];
  const also = calAlso(f);
  const sync = async () => {
    if (CAL_SYNCING) return;
    await syncCalendars({quiet: false, only: f.url});
    if (m.root.isConnected) drawCalendarSettings(url);
  };
  const m = calScreen({
    title: name, back: "Calendars", backTo: drawCalendars,
    body: el("div", {},
      calRow("Shared with", also.length ? also.join(", ") : "No other areas", () => drawCalendarSharing(url)),
      calFact("Calendar link", calMaskUrl(f.url)),
      calFact("Last synced", at ? calClock(at) : "Not yet"),
      el("div", {style: "padding:6px 16px;display:flex;flex-direction:column;align-items:flex-start;gap:6px"},
        el("button", {class: "textbtn", onclick: sync}, "Sync now"),
        el("button", {class: "textbtn danger", onclick: () => {
          setCalFeeds(calFeeds().filter(x => x.url !== f.url));
          calStamp(CAL_REMOVED_KEY, feed);
          drawCalendars();
        }}, "Remove calendar"))),
  });
  return m;
}
