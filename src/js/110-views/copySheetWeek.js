/* Tabs between the columns, so it pastes into a spreadsheet as cells. */
function copySheetWeek(w) {
  const cols = sheetCols(w), [wk, yr] = isoWeek(w.monday);
  copyText([yr + "-W" + pad2(wk), ["Date", ...cols.map(c => c.head)].join("\t"),
    ...w.days.map(d => [dayWithName(d.date), ...cols.map(c => c.cell(d))].join("\t")),
    [w.S.onHand ? "End of week" : "Week", ...cols.map(c => c.foot())].join("\t")].join("\n"),
    "Week " + wk + " copied. It pastes into a spreadsheet as cells.");
}
