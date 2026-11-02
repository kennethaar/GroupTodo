/* Each clock on a line: the day it started and its minutes. */
function blockClocks(b) {
  const lb = logbookOf(b), out = [];
  if (!lb) return out;
  const today = todayISO();
  for (const l of lb) {
    const m = CLOCK_RE.exec(trim(l));
    if (!m) continue;
    const a = new Date(m[1] + "T" + pad2(+m[2]) + ":" + m[3] + ":" + (m[4] || "00"));
    if (m[5]) {
      const z = new Date(m[5] + "T" + pad2(+m[6]) + ":" + m[7] + ":" + (m[8] || "00"));
      out.push({day: m[1], min: Math.max(0, Math.round((z - a) / 60000))});
    } else out.push({day: m[1], running: true, open: m[1] === today, stale: m[1] !== today,
      min: m[1] === today ? Math.max(0, Math.round((Date.now() - a) / 60000)) : 0});
  }
  return out;
}
