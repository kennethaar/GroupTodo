function clockEntries(b) {
  const out = [];
  for (const l of logbookOf(b) || []) {
    const m = CLOCK_RE.exec(trim(l));
    if (m) out.push({start: clockAt(m[1], m[2], m[3], m[4]), end: m[5] ? clockAt(m[5], m[6], m[7], m[8]) : null});
  }
  return out;
}
