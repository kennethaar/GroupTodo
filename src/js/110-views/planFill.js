function planFill(rows, minutes) {
  let left = minutes;
  const take = new Set();
  for (const r of rows.slice().sort(byUrgency)) {
    const m = estOfRow(r);
    if (m && m <= left) { take.add(r); left -= m; }
  }
  return rows.filter(r => take.has(r));
}
