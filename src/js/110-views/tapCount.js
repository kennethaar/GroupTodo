function tapCount(raw) {
  const s = trim(raw);
  const times = TAP_TIMES_RE.exec(s);
  if (times) return Number(times[2]);
  return /^\d+$/.test(s) ? Number(s) : tapIcons(s).length;
}
