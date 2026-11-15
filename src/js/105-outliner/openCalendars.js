async function openCalendars() {
  // Every area can take a calendar, not only the ones on screen: read the rest in first.
  await Promise.all(Spaces.list.filter(s => !LOADED.has(s.name)).map(s => loadSpaceRecord(s.name).catch(() => null)));
  drawCalendars();
}
/* The first screen: reminders, the calendars, and the way to add one. */
function drawCalendars() {
  const c = calendarsBody();
  return calScreen({title: "Calendars", hint: c.sync, body: c.body, foot: c.foot});
}
