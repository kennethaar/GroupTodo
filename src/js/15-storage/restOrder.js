function restOrder(paths) {
  const weekAgo = shiftISO(todayISO(), -7);
  const rank = new Map(paths.map(p => [p, restRank(p, weekAgo)]));
  return paths.slice().sort((a, b) => rank.get(a) - rank.get(b) || (dayOfPath(b) || "").localeCompare(dayOfPath(a) || ""));
}
