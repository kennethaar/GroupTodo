/* The Calendars dialog's first screen as parts: its rows, Sync now and the
   note on removed calendars. The dialog and Settings draw the same (#397).
   go wraps what a row opens: Settings reads every area in first, as
   openCalendars does. */
function calendarsBody(go = fn => fn, redraw = drawCalendars) {
  const feeds = calFeeds(), orphans = calOrphans();
  const sync = el("button", {class: "textbtn", onclick: async () => {
    if (CAL_SYNCING) return;
    sync.textContent = "Syncing…";
    await syncCalendars({quiet: false});
    if (sync.isConnected) redraw();
  }}, "Sync now");
  const left = orphans.reduce((n, g) => n + g.n, 0);
  return {
    sync: feeds.length ? sync : null,
    body: el("div", {},
      calRow("Meeting reminders", meetRemindLabel(), go(drawMeetRemind)),
      feeds.length ? el("div", {class: "callabel"}, "Your calendars") : null,
      ...feeds.map(f => calRow(f.label || calHost(f.url), calSharedLabel(f) + " · " + calSyncedLabel(f), go(() => drawCalendarSettings(f.url)))),
      feeds.length ? null : el("p", {class: "hint", style: "text-align:left;padding:0 16px"}, "No calendars added."),
      el("div", {style: "padding:6px 16px"}, el("button", {class: "textbtn", onclick: go(drawAddCalendar)}, "+ Add calendar"))),
    foot: orphans.length ? [el("span", {class: "calnote"},
      left + (left === 1 ? " meeting remains" : " meetings remain") + " from " + (orphans.length === 1 ? "a removed calendar" : "removed calendars")),
      el("button", {class: "textbtn", onclick: go(drawRemovedCalendars)}, "Review")] : null,
  };
}
