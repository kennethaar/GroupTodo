/* One chip per column of the board, pressed while shown: the list view's way
   of putting the same columns away. */
function shownChips(by, label, keys, labelOf, countOf) {
  const putAway = hiddenCols(by);
  return keys.length ? el("div", {class: "ctxdrops"}, el("span", {class: "say"}, label),
    ...keys.map(k => fchip(labelOf(k), !putAway.has(k), () => {
      const next = hiddenCols(by);
      if (next.has(k)) next.delete(k); else next.add(k);
      setColsHidden(by, next);
    }, countOf(k)))) : null;
}
