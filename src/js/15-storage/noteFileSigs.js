/* After a full read: how many files had the same date and size as at the
   last read on this device. Those are what a copy kept in the browser would
   not have had to read again (#181). The dates and sizes are kept for next
   time. */
function noteFileSigs(record) {
  const t = record.backend && record.backend.timing;
  if (!t) return;
  READ_TIMING.set(record.name, t);
  if (!t.sigs || !t.sigs.size) return;
  const key = "filesigs:" + record.name;
  let before = null;
  try { before = JSON.parse(PREF.get(key, "") || "null"); } catch (_) {}
  if (before) {
    let same = 0;
    for (const [p, sig] of t.sigs) if (before[p] === sig) same++;
    t.unchanged = {same, total: t.sigs.size};
  }
  try { PREF.set(key, JSON.stringify(Object.fromEntries(t.sigs))); } catch (_) {}
}
