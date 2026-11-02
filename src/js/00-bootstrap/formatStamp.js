/* "2026-10-05T18:43:38Z" -> "5 Oct 2026, 20:43" in the chosen zone. */
function formatStamp(iso, opts = {}) {
  const d = new Date(iso);
  if (!iso || isNaN(d.getTime())) return iso || "";
  try {
    return new Intl.DateTimeFormat(undefined, Object.assign({
      dateStyle: "medium", timeStyle: "short", timeZone: userTZ(),
    }, opts)).format(d);
  } catch (_) { return String(iso); }
}
