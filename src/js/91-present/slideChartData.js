/* What a chart draws (#482): `cats` along it and one or more `series` of
   numbers. From one Markdown table: its first column gives the categories
   and each column of numbers a series named by its header. Else from lines
   that each end in a number, one series; `shown` keeps the numbers as written.
   null when the lines are not all so. */
function slideChartData(kids) {
  if (!kids?.length) return null;
  if (kids.length === 1 && tableRows(kids[0])) {
    const t = kids[0], head = tableCells(t.title);
    const rows = t.body.slice(1, tableRows(t)).map(tableCells);
    if (!rows.length) return null;
    const series = [];
    for (let c = 1; c < head.length; c++) {
      const values = rows.map(r => slideChartNum(r[c]));
      if (values.every(v => v !== null)) series.push({name: trim(head[c]), values});
    }
    return series.length ? {cats: rows.map(r => trim(r[0] || "")), series} : null;
  }
  const points = kids.map(k => slideChartPoint(slideWords(k)));
  if (points.some(p => !p)) return null;
  return {cats: points.map(p => p.label), series: [{name: "", values: points.map(p => p.value), shown: points.map(p => p.shown)}]};
}
