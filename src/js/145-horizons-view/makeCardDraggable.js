/* Marks a card as a thing that can be dragged and a thing that can be picked.
   Ctrl-click -- cmd-click on a Mac -- adds it to the handful instead of opening
   it; the opening is the plain click, handled by the card itself. */
function makeCardDraggable(card, kind, item, id) {
  BOARD_ITEMS.set(boardKey(kind, id), item);
  // What the card stands for, written on the card, so picking cards out can be
  // done to the cards already on screen instead of by redrawing them.
  card.dataset.selkind = kind;
  card.dataset.selid = String(id);
  card.dataset.space = item.space || V.space;
  card.dataset.path = item.path || (typeof item === "string" ? item : "");
  if (item.block) card.dataset.id = item.block.id;
  if (boardSelHas(kind, id)) card.classList.add("sel");
  card.addEventListener("dragstart", e => {
    const items = boardDragItems(kind, id);
    // The column it left, for a board whose columns are tags: a move between
    // two of them takes the old tag off as it puts the new one on.
    DRAGGED = {kind, items, fromTag: card.closest(".bcol")?.dataset.tag || ""};
    card.classList.add("dragging");
    // Everything coming along fades too, so the drag looks like its own size.
    if (items.length > 1) $$(".bcard.sel").forEach(c => c.classList.add("dragging-with"));
    try {
      e.dataTransfer.setData("text/plain", items.length > 1 ? items.length + " cards" : String(id));
      // A page dropped on a space tab can be copied instead of moved, so the
      // drag has to allow both and let the drop decide.
      e.dataTransfer.effectAllowed = "copyMove";
    } catch (_) {}
  });
  card.addEventListener("dragend", () => {
    card.classList.remove("dragging");
    $$(".bcard.dragging-with").forEach(c => c.classList.remove("dragging-with"));
    DRAGGED = null;
  });
  return card;
}
