/* What is on hand of each thing at the end of a day: every change up to it,
   started again from each count. */
function onHandAt(rows, date) {
  const m = new Map();
  for (const r of rows) {
    if (r.date > date) break;
    m.set(r.name, r.set ? r.value : (m.get(r.name) || 0) + r.value);
  }
  return m;
}
