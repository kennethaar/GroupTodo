/* "26 Oct – 1 Nov 2026", "9–15 Nov 2026"; without the year, "9–15 Nov".
   In the order the language writes a range in. */
function weekRange(id, year = true) {
  const days = weekDays(id);
  if (!days.length) return "";
  return new Intl.DateTimeFormat(undefined, {day: "numeric", month: "short", year: year ? "numeric" : undefined})
    .formatRange(parseISO(days[0]), parseISO(days[6]));
}
