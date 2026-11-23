/* A chart's number for its label (#482): as written on the line when it
   was ("NOK 40k"), else the value, at most two decimals: 14, 3.25. */
function slideChartFmt(ser, i) {
  return ser.shown?.[i] ?? String(+ser.values[i].toFixed(2));
}
