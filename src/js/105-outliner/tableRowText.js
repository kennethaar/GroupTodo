// A row as it is written: "| a | b |", padded out to n cells.
function tableRowText(cells, n = cells.length) {
  const all = cells.slice(0, Math.max(n, cells.length));
  while (all.length < n) all.push("");
  return "| " + all.join(" | ") + " |";
}
