function hiddenColsBar(by, labelOf) {
  const hidden = hiddenCols(by);
  if (!hidden.size) return null;
  const keys = Array.from(hidden).sort((x, y) => (x ? 1 : 0) - (y ? 1 : 0) || x.localeCompare(y));
  return el("div", {class: "ctxdrops"}, el("span", {class: "say"}, "Hidden columns, click one to show it again"),
    ...keys.map(k => el("button", {class: "fchip", onclick: () => { const next = hiddenCols(by); next.delete(k); setColsHidden(by, next); }},
      labelOf(k))),
    keys.length > 1 ? el("button", {class: "textbtn", onclick: () => setColsHidden(by, new Set())}, "Show all") : null);
}
