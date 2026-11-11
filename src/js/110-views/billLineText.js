/* One billed line as words: a project's hours at the rate, or a priced task
   and, when the client pays only a share, its share. */
function billLineText(l) {
  if (l.kind === "price") return l.title + (l.pct < 99.5 ? " (" + Math.round(l.pct) + "%: " + fmtPrices(l.amount) + ")" : "");
  const h = fmtSheet(sheetById("clients"), l.min);
  return l.title + ": " + h + (l.rate ? " × " + fmtPrice(l.rate.cur, l.rate.amount) + " = " + fmtPrices(l.amount) : "");
}
