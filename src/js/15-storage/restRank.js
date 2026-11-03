function restRank(p, weekAgo) {
  if (p.startsWith(DIRS.active + "/")) return 0;
  if (isJournalPath(p)) return dayOfPath(p) >= weekAgo ? 1 : 4;
  if (SOON_DIRS.some(d => p.startsWith(d + "/"))) return 1;
  return [DIRS.waiting, DIRS.someday].some(d => p.startsWith(d + "/")) ? 2 : 3;
}
