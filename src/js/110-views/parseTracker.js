function parseTracker(text) {
  const m = TRACKER_RE.exec(trim(String(text || "")));
  if (!m) return null;
  const raw = trim(m[3]), code = (m[2] || "").toLowerCase();
  return {name: m[1].toLowerCase(), code,
    key: "tracker-" + m[1] + (m[2] ? "_" + m[2] : ""),
    values: !raw ? [] : wholeLineTracker(code) ? [raw] : raw.split("/").map(trim), raw};
}
