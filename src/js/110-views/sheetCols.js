/* The columns of a week, the same on screen and when copied. */
function sheetCols(w) {
  const S = w.S, F = (v, s) => fmtSheet(S, v, s), unit = sheetUnit(S);
  const last = w.days[6];
  return [
    ...(w.kinds.length > 1 || S.onHand ? w.kinds.map(([k, label]) => ({head: label,
      cell: d => d.byKind.has(k) ? F(d.byKind.get(k)) : "",
      foot: () => S.onHand ? (last.byKind.has(k) ? F(last.byKind.get(k)) : "") : F(w.days.reduce((s, d) => s + (d.byKind.get(k) || 0), 0))})) : []),
    ...(S.onHand && w.kinds.length < 2 ? [] : [{head: S.total + (unit ? " (" + unit + ")" : ""), strong: true,
      cell: d => F(d.total), foot: () => F(w.total)}]),
    ...w.split.map(p => ({head: p.name + " " + p.pct + " %", cell: d => F(d.total * p.pct / 100), foot: () => F(w.total * p.pct / 100)})),
    ...(w.target ? [{head: S.diff.head, diff: true, cell: d => d.diff == null ? "" : F(d.diff, true), foot: () => F(w.diff, true)}] : []),
  ];
}
