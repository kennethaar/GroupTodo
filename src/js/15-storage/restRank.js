function restRank(p, weekAgo) {
  if (isJournalPath(p)) return dayOfPath(p) >= weekAgo ? 0 : 3;
  if (SOON_DIRS.some(d => p.startsWith(d + "/"))) return 0;
  return [DIRS.waiting, DIRS.someday].some(d => p.startsWith(d + "/")) ? 1 : 2;
}
