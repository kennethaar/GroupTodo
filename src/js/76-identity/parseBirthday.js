function parseBirthday(v) {
  const m = /^\s*(?:(\d{4})-|--)?(\d{1,2})-(\d{1,2})\s*$/.exec(String(v || ""));
  if (!m || +m[2] < 1 || +m[2] > 12 || +m[3] < 1 || +m[3] > 31) return null;
  return {year: m[1] ? +m[1] : null, month: +m[2], day: +m[3]};
}
