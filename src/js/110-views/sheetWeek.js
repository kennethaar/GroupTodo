/* A week: each day by column, the total with the extra, the shares and how
   it stands against the target. A day still to come has nothing to stand
   against yet. */
function sheetWeek(S, monday) {
  const all = sheetEntries(S), end = shiftISO(monday, 6), today = todayISO();
  const rows = all.filter(e => e.date >= monday && e.date <= end);
  const target = sheetTarget(S), extra = S.extra ? sheetNum(S, sheetSetting(S, "extra")) : 0;
  const days = Array.from({length: 7}, (_, i) => {
    const date = shiftISO(monday, i);
    const items = rows.filter(e => e.date === date);
    let byKind, total;
    if (S.onHand) {
      byKind = onHandAt(all, date);
      total = [...byKind.values()].reduce((s, v) => s + v, 0);
    } else {
      byKind = new Map();
      for (const e of items) byKind.set(e.name, (byKind.get(e.name) || 0) + e.value);
      const sum = items.reduce((s, e) => s + e.value, 0);
      total = sum + (sum ? extra : 0);
    }
    const diff = target && date <= today ? S.diff.of(total, target[weekdayOf(date)]) : null;
    return {date, items, byKind, total, diff, any: items.length > 0,
      open: items.some(e => e.open), stale: items.some(e => e.stale)};
  });
  return {S, monday, days, rows, target, extra, split: sheetSplit(S), kinds: sheetKinds(S),
    total: S.onHand ? days[6].total : days.reduce((s, d) => s + d.total, 0),
    diff: target ? days.reduce((s, d) => s + (d.diff || 0), 0) : null,
    count: days.filter(d => d.any).length};
}
