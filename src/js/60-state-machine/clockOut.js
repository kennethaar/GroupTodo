function clockOut(b) {
  const lb = logbookOf(b);
  if (!lb) return;
  const i = lb.findIndex(l => { const m = CLOCK_RE.exec(trim(l)); return m && !m[5]; });
  if (i < 0) return;
  const m = CLOCK_RE.exec(trim(lb[i]));
  const from = new Date(m[1] + "T" + pad2(+m[2]) + ":" + m[3] + ":" + (m[4] || "00"));
  const now = new Date(), s = Math.max(0, Math.round((now - from) / 1000));
  if (s * 1000 < CLOCK_GRACE_MS) {
    lb.splice(i, 1);
    if (lb.every(l => /^:(LOGBOOK|END):$/i.test(trim(l)))) b.drawers.splice(b.drawers.indexOf(lb), 1);
    return;
  }
  lb[i] = trim(lb[i]) + "--[" + clockStamp(now) + "] =>  " +
    pad2(Math.floor(s / 3600)) + ":" + pad2(Math.floor(s / 60) % 60) + ":" + pad2(s % 60);
}
