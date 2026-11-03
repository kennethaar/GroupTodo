function restOrder(paths) {
  const monthAgo = shiftISO(todayISO(), -SHOWN_DAYS);
  const rank = new Map(paths.map(p => [p, restRank(p, monthAgo)]));
  return paths.slice().sort((a, b) => rank.get(a) - rank.get(b) || (dayOfPath(b) || "").localeCompare(dayOfPath(a) || ""));
}
