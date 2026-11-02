function weekMonday(id) {
  const m = WEEK_RE.exec(id || "");
  if (!m) return null;
  // 4 January is always in week 1.
  const d = new Date(+m[1], 0, 4);
  d.setDate(d.getDate() - (d.getDay() + 6) % 7 + (+m[2] - 1) * 7);
  return weekOf(isoOf(d)) === id ? isoOf(d) : null;
}
