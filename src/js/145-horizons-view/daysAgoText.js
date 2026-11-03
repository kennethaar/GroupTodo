/* Today, yesterday, 3 days ago, then the date. */
function daysAgoText(day) {
  const d = dateDiffDays(day, todayISO());
  return d == null ? "" : d <= 0 ? "today" : d === 1 ? "yesterday" : d < 7 ? d + " days ago" : humanDate(day);
}
