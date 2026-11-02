/* A day and a month without a year is the next one of them, never last year's. */
function whenDayMonth(d, mo, y, today) {
  const year = y ? (y < 100 ? 2000 + y : y) : Number(today.slice(0, 4));
  if (mo < 1 || mo > 12 || d < 1) return null;
  const last = new Date(Date.UTC(year, mo, 0)).getUTCDate();
  if (d > last) return null;
  const iso = year + "-" + pad2(mo) + "-" + pad2(d);
  return !y && iso < today ? whenDayMonth(d, mo, year + 1, today) : iso;
}
