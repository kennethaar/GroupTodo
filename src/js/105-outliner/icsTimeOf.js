function icsTimeOf(p, tz, allDay) {
  const w = p && icsWall(p.value);
  if (!w) return null;
  return allDay || w.date ? new Date(w.y, w.m - 1, w.d).getTime() : icsInstant(w, p.params.TZID || tz, w.utc);
}
