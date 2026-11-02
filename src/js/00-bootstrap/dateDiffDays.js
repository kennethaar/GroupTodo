function dateDiffDays(d1, d2) {           // d2 - d1, in days
  const a = parseISO(d1), b = parseISO(d2);
  if (!a || !b) return null;
  return Math.round((b - a) / 86400000);
}
