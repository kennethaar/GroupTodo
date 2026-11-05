async function openCalendars() {
  // Every area can take a calendar, not only the ones on screen: read the rest in first.
  await Promise.all(Spaces.list.filter(s => !LOADED.has(s.name)).map(s => loadSpaceRecord(s.name).catch(() => null)));
  drawCalendars();
}
/* The first screen: reminders, the calendars, and the way to add one. */
function drawCalendars() {
  const feeds = calFeeds(), orphans = calOrphans();
  const sync = el("button", {class: "textbtn", onclick: async () => {
    if (CAL_SYNCING) return;
    sync.textContent = "Syncing…";
    await syncCalendars({quiet: false});
    if (sync.isConnected) drawCalendars();
  }}, "Sync now");
  const left = orphans.reduce((n, g) => n + g.n, 0);
  return calScreen({
    title: "Calendars", hint: feeds.length ? sync : null,
    body: el("div", {},
      calRow("Meeting reminders", meetRemindLabel(), drawMeetRemind),
      feeds.length ? el("div", {class: "callabel"}, "Your calendars") : null,
      ...feeds.map(f => calRow(f.label || calHost(f.url), calSharedLabel(f) + " · " + calSyncedLabel(f), () => drawCalendarSettings(f.url))),
      feeds.length ? null : el("p", {class: "hint", style: "text-align:left;padding:0 16px"}, "No calendars added."),
      el("div", {style: "padding:6px 16px"}, el("button", {class: "textbtn", onclick: drawAddCalendar}, "+ Add calendar"))),
    foot: orphans.length ? [el("span", {class: "calnote"},
      left + (left === 1 ? " meeting remains" : " meetings remain") + " from " + (orphans.length === 1 ? "a removed calendar" : "removed calendars")),
      el("button", {class: "textbtn", onclick: drawRemovedCalendars}, "Review")] : null,
  });
}
