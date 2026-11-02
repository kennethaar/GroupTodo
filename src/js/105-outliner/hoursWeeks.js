function hoursWeeks(rows) {
  const g = new Map();
  for (const e of rows) {
    const k = weekStartISO(e.date);
    if (!g.has(k)) g.set(k, []);
    g.get(k).push(e);
  }
  return [...g.entries()].sort((a, b) => b[0].localeCompare(a[0]));
}
