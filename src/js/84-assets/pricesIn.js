/* Each price on a line: its currency and how much. */
function pricesIn(text) {
  const out = [];
  const bare = String(text || "").replace(new RegExp(PRICE_SKIP, "g"), " ");
  for (const m of bare.matchAll(PRICE_RE)) {
    const cur = m[1] || m[4], num = m[2] || m[3];
    out.push({cur: PRICE_SYM[cur] || (/^kr/.test(cur) ? "kr" : cur), amount: priceAmount(num)});
  }
  return out;
}
