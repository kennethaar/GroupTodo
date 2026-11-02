function whenUntilWords(day, time) {
  if (time) {
    const m = minutesUntil(day, time);
    if (m <= -1 && m > -1440) return "started " + (m > -60 ? -m + " min" : Math.floor(-m / 60) + " h") + " ago";
    if (m > -1 && m < 1) return "now";
    if (m >= 1 && m < 60) return "in " + m + " min";
    if (m >= 60 && m < 1440) return "in " + Math.floor(m / 60) + " h" + (m % 60 ? " " + (m % 60) + " min" : "");
  }
  const d = dateDiffDays(todayISO(), day);
  return d === 0 ? "today" : d === 1 ? "tomorrow" : d < 0 ? -d + " days late" : "in " + d + " days";
}
