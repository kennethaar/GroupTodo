function templateCandidates(date, kind) {
  const list = [];
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date || "");
  if (m) {
    const [, y, mo, d] = m;
    const w = isoWeek(date);
    list.push(date);
    if (w) list.push(`${w[1]}-W${pad2(w[0])}`);
    const day = WEEKDAY_NAMES[new Date(+y, +mo - 1, +d).getDay()];
    list.push(...day.map(n => `${y}-${n}`));
    list.push(`${y}-Q${Math.ceil(+mo / 3)}`, `${y}-H${+mo <= 6 ? 1 : 2}`, `${y}-${mo}`, `${mo}-${d}`, y, mo);
  }
  if (kind) list.push(kind);
  return list;
}
