function copySheetYear(y) {
  const cols = sheetYearCols(y);
  copyText([y.S.title + " " + y.year, ["Month", ...cols.map(c => c.head)].join("\t"),
    ...y.months.map(m => [m.key, ...cols.map(c => c.cell(m))].join("\t")),
    ["Year", ...cols.map(c => c.foot())].join("\t")].join("\n"), y.year + " copied.");
}
