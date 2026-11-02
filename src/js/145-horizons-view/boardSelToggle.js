/* Picking a card of one kind lets go of anything picked of the other. */
function boardSelToggle(kind, id) {
  if (BOARD_SEL.kind !== kind) { BOARD_SEL.kind = kind; BOARD_SEL.ids.clear(); }
  if (BOARD_SEL.ids.has(String(id))) BOARD_SEL.ids.delete(String(id));
  else BOARD_SEL.ids.add(String(id));
  if (!BOARD_SEL.ids.size) BOARD_SEL.kind = null;
  paintBoardSel();
}
