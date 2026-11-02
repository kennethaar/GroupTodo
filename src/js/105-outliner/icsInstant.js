/* A wall-clock time in a zone, as an instant. No zone, or one this browser
   does not know, is read as local time. */
function icsInstant(w, tz, utc) {
  if (utc) return Date.UTC(w.y, w.m - 1, w.d, w.h, w.mi, w.s);
  const zone = tz && (WIN_TZ[tz] || tz);
  if (zone) {
    try {
      const guess = Date.UTC(w.y, w.m - 1, w.d, w.h, w.mi, w.s);
      const first = guess - tzOffsetAt(zone, guess);
      return guess - tzOffsetAt(zone, first);
    } catch (_) {}
  }
  return new Date(w.y, w.m - 1, w.d, w.h, w.mi, w.s).getTime();
}
