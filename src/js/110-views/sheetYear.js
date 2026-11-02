/* A year by months. Hours: the days in each place -- the days at the office
   are what a travel deduction asks for -- and the hours. Amounts: what each
   came to. Stock: what was on hand at the end of each month. */
function sheetYear(S, year) {
  const all = sheetEntries(S), rows = all.filter(e => e.date.startsWith(year + "-"));
  const kinds = sheetKinds(S), extra = S.extra ? sheetNum(S, sheetSetting(S, "extra")) : 0;
  const months = Array.from({length: 12}, (_, i) => {
    const key = year + "-" + pad2(i + 1);
    const items = rows.filter(e => e.date.startsWith(key) && (!S.time || e.value > 0 || e.open));
    const days = n => new Set(items.filter(e => n == null || e.name === n).map(e => e.date)).size;
    const sum = n => items.filter(e => e.name === n).reduce((s, e) => s + e.value, 0);
    const worked = days(null);
    const hand = !S.onHand ? null : key <= todayISO().slice(0, 7) ? onHandAt(all, key + "-31") : new Map();
    return {key, label: parseISO(key + "-01").toLocaleDateString(undefined, {month: "long"}),
      days: kinds.map(([n]) => days(n)), sums: kinds.map(([n]) => sum(n)), hand, worked,
      total: S.onHand ? [...hand.values()].reduce((s, v) => s + v, 0) : items.reduce((s, e) => s + e.value, 0) + worked * extra};
  });
  return {S, year, kinds, months};
}
