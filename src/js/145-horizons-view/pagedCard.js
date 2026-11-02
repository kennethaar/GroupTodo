function pagedCard(items, makeRow, emptyText, step) {
  const card = el("div", {class: "card"});
  if (!items.length) {
    card.append(el("div", {class: "empty"}, emptyText || "Nothing here."));
    return card;
  }
  const n = step || CFG.rowsPerPage;
  let drawn = 0;
  const drawTo = upto => {
    for (let i = drawn; i < upto; i++) card.insertBefore(makeRow(items[i], i), more);
    drawn = upto;
    const left = items.length - drawn;
    if (!left) { more.remove(); return; }
    more.set("Show " + Math.min(left, n) + " more \u00B7 " + left + " below",
             left > n ? "Show all " + items.length : "");
  };
  const more = moreRow(() => drawTo(Math.min(items.length, drawn + n)),
                       () => drawTo(items.length));
  card.append(more);
  drawTo(Math.min(items.length, n));
  return card;
}
