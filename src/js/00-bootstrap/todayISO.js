function todayISO() {
  const tz = (typeof PREF !== "undefined") ? PREF.get("timezone", "") : "";
  if (!tz) return isoOf(new Date());
  try {
    return new Intl.DateTimeFormat("en-CA", {timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit"})
      .format(new Date());
  } catch (_) { return isoOf(new Date()); }
}
