/* Says the count and offers the way out, so a selection can never be a thing
   you are stuck in without knowing it. */
function boardSelBar() {
  if (!BOARD_SEL.ids.size) return null;
  const n = BOARD_SEL.ids.size;
  const bar = el("div", {class: "bsel"},
    el("span", {}, n + (n === 1 ? " card picked" : " cards picked") +
      " \u00B7 drag any one of them to move them all"));
  for (const a of boardSelActions()) {
    bar.append(el("button", {class: "btn sm ghost", title: a.hint, onclick: a.run}, a.label));
  }
  bar.append(el("button", {class: "btn sm ghost", style: "margin-left:auto",
    onclick: () => { boardSelClear(); paintBoardSel(); }}, "Clear"));
  return bar;
}
