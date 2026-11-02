function sendToCalendar(kind, items) {
  if (kind === "ics" || !items.every(a => a.due)) {
    const name = items.length === 1
      ? "task-" + slugify(titleForRow(items[0].title)).toLowerCase().replace(/[^\w-]+/g, "-") + ".ics"
      : "grouptodo-dates.ics";
    downloadText(name, icsFor(items));
    notify("Saved " + name + ". Open it and your calendar will offer to add " +
           (items.length === 1 ? "it." : "them."));
    return;
  }
  if (items.length > 1) {           // no deeplink takes a batch; the file does
    downloadText("grouptodo-dates.ics", icsFor(items));
    notify("That calendar takes one event per link, so here are all " + items.length +
           " as a file instead.");
    return;
  }
  const url = calendarLink(kind, items[0]);
  if (!url) return;
  window.open(url, "_blank", "noopener");
}
