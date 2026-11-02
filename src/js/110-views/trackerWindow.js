function trackerWindow(groups) {
  const today = todayISO();
  const latest = groups.flatMap(g => g.entries.map(e => e.date)).sort().pop() || today;
  const end = latest >= shiftISO(today, 1 - TRACKER_DAYS) ? today : latest;
  return Array.from({length: TRACKER_DAYS}, (_, i) => shiftISO(end, i + 1 - TRACKER_DAYS));
}
