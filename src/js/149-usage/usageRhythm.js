function usageRhythm(x, weeks) {
  if (!x.days.size) return "not opened";
  if (weeks >= 3 && x.weeks.size >= Math.ceil(weeks * 0.6)) return "steady";
  if (dateDiffDays(x.last, todayISO()) > 30) return "stopped";
  return "now and then";
}
