const usageSorted = rows => rows.slice().sort((a, b) =>
  b.weeks.size - a.weeks.size || b.days.size - a.days.size || b.secs - a.secs ||
  usageLabel(a.place).localeCompare(usageLabel(b.place)));
