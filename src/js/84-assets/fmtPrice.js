function fmtPrice(cur, n) {
  const [group, dec] = PRICE_MARKS[cur] || ",.";
  const [whole, frac] = Math.abs(n).toFixed(2).split(".");
  const v = (n < 0 ? "-" : "") + whole.replace(/\B(?=(\d{3})+$)/g, group) + (frac === "00" ? "" : dec + frac);
  return cur === "kr" ? v + " kr" : cur + " " + v;
}
