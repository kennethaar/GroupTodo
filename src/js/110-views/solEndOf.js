function solEndOf(key) {
  const t = parseISO(todayISO()), n = +key[1];
  if (key[0] === "w") { t.setDate(t.getDate() + (7 - t.getDay()) % 7 + 7 * n); return isoOf(t); }
  const span = {m: 1, q: 3, h: 6, y: 12}[key[0]];
  const start = Math.floor(t.getMonth() / span) * span + span * (n + 1);
  return isoOf(new Date(t.getFullYear(), start, 0, 12));
}
