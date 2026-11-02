/* "13:00–14:00", "13:00-14:00", "9.30", "13:00" -> minutes after midnight. */
function meetingClock(b) {
  const raw = trim(blockProp(b, "time") || "");
  const m = /^(\d{1,2})[:.](\d{2})(?:\s*[–\-—]\s*(\d{1,2})[:.](\d{2}))?/.exec(raw);
  if (!m) return null;
  const start = +m[1] * 60 + +m[2];
  const end = m[3] != null ? +m[3] * 60 + +m[4] : null;
  return start < 24 * 60 ? {start, end: end != null && end > start ? end : null} : null;
}
