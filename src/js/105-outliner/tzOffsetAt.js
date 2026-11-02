function tzOffsetAt(tz, ms) {
  const parts = new Intl.DateTimeFormat("en-US", {timeZone: tz, hourCycle: "h23", year: "numeric", month: "numeric",
    day: "numeric", hour: "numeric", minute: "numeric", second: "numeric"}).formatToParts(new Date(ms));
  const g = t => +parts.find(p => p.type === t).value;
  return Date.UTC(g("year"), g("month") - 1, g("day"), g("hour") % 24, g("minute"), g("second")) - ms;
}
