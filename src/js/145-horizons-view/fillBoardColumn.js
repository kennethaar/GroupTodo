/* Fills a column body with cards, a card at a time, and keeps the "show more"
   row the lists use so one busy column cannot bury the rest. */
function fillBoardColumn(body, items, key, mkCard) {
  /* On a phone the columns are stacked, so a hundred cards in the first one
     means scrolling past all of them to reach the second. */
  const step = window.innerWidth < 860 ? CFG.boardPerPhone : CFG.boardPerColumn;
  const shown = (state.boardMore || {})[key] || step;
  items.slice(0, shown).forEach(x => body.append(mkCard(x)));
  if (items.length > shown) {
    const left = items.length - shown;
    const setTo = n => {
      const more = Object.assign({}, state.boardMore);
      more[key] = n;
      state.boardMore = more;
      render();
    };
    const row = moreRow(() => setTo(shown + step), () => setTo(items.length));
    row.set("Show " + Math.min(step, left) + " more \u00B7 " + left + " below",
            left > step ? "Show all " + items.length : "");
    body.append(row);
  }
  if (!items.length) body.append(el("div", {class: "empty", style: "font-size:12px"}, "Nothing here."));
  /* A column is as wide as what is in it calls for: the one holding thirty
     projects gets the room, the empty one gives it up. Read once the body is
     in its column, which the caller does straight after this returns. */
  const grow = 1 + Math.min(items.length, 24) / 12;
  queueMicrotask(() => { const col = body.closest(".bcol"); if (col) col.style.setProperty("--grow", grow.toFixed(2)); });
  return body;
}
