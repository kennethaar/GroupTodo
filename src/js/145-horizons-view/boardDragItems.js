/* The items a drag is actually carrying. Dragging a card that is picked carries
   the whole selection; dragging one that is not carries just itself, and lets go
   of the selection -- the same bargain a file manager makes. */
function boardDragItems(kind, id) {
  if (boardSelHas(kind, id)) {
    const out = [];
    for (const sid of BOARD_SEL.ids) {
      const it = BOARD_ITEMS.get(boardKey(kind, sid));
      if (it) out.push(it);
    }
    if (out.length) return out;
  }
  const one = BOARD_ITEMS.get(boardKey(kind, id));
  return one ? [one] : [];
}
