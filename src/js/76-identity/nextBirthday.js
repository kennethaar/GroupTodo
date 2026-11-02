// The next time it comes round, today included, and how old they turn then.
function nextBirthday(b, from = todayISO()) {
  const on = y => isoOf(new Date(y, b.month - 1, b.day, 12));
  const y = +from.slice(0, 4);
  const iso = on(y) >= from ? on(y) : on(y + 1);
  const age = b.year ? +iso.slice(0, 4) - b.year : 0;
  return {iso, days: dateDiffDays(from, iso), age: age > 0 ? age : null};
}
