function sheetYearCols(y) {
  const S = y.S, F = v => fmtSheet(S, v), many = y.kinds.length > 1;
  const add = f => y.months.reduce((s, m) => s + f(m), 0);
  if (S.onHand) return [...y.kinds.map(([n, label]) => ({head: label, cell: m => m.hand.has(n) ? F(m.hand.get(n)) : "",
    foot: () => { const h = y.months[11].hand; return h.has(n) ? F(h.get(n)) : ""; }})),
    ...(many ? [{head: S.total, cell: m => m.hand.size ? F(m.total) : "", foot: () => F(y.months[11].total)}] : [])];
  return [
    ...(S.days ? y.kinds.map(([, label], i) => ({head: label + " days", cell: m => String(m.days[i] || ""), foot: () => String(add(m => m.days[i]))}))
      : many ? y.kinds.map(([, label], i) => ({head: label, cell: m => m.sums[i] ? F(m.sums[i]) : "", foot: () => F(add(m => m.sums[i]))})) : []),
    ...(S.days && many ? [{head: "Days worked", cell: m => String(m.worked || ""), foot: () => String(add(m => m.worked))}] : []),
    {head: S.total + (sheetUnit(S) ? " (" + sheetUnit(S) + ")" : ""), cell: m => m.total ? F(m.total) : "", foot: () => F(add(m => m.total))},
  ];
}
