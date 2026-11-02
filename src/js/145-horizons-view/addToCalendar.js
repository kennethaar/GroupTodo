/* The button itself: straight to the remembered calendar, long-press-free. */
function addToCalendar(items) {
  const dated = items.filter(a => a.due);
  if (!dated.length) { notify("Give it a date first - SCHEDULED or a deadline.", "warn"); return; }
  const chosen = calendarChoice();
  if (!chosen) return openCalendarPicker(dated);
  sendToCalendar(chosen, dated);
}
