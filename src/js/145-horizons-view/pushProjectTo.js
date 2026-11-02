function pushProjectTo(path, iso) {
  const start = projectStart(path);
  if (!start) return 0;
  const days = dateDiffDays(start, iso);
  return days > 0 ? shiftProjectBy(path, days) : 0;
}
