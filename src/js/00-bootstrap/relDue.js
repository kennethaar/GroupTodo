/* How far off a due date is, counted the way you scan a list: "3 d late",
   "in 5 d". Today, tomorrow and yesterday already say it in the date itself,
   and beyond a month the number stops meaning anything. */
function relDue(iso) {
  const n = dateDiffDays(todayISO(), iso);
  if (n == null || Math.abs(n) <= 1) return "";
  if (n < 0) return -n + " d late";
  return n <= 30 ? "in " + n + " d" : "";
}
