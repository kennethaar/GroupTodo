/* ---------- what a handful of cards can be told ----------
   A drag answers one question -- which column does this belong in -- and that
   was the only question the board could answer about several cards at once.
   But the reason you pick out eight cards is usually not the column: it is
   that they are all for the same person, all part of the same org, all done in
   the same place. Saying that eight times, one panel at a time, is the work
   this takes away.

   Every button here writes exactly what the single-card controls write -- a
   [[c/...]] on the line, an assigned:: on the block, an org:: on the page --
   so nothing on this bar is a second way of recording the same fact, and one
   ctrl-z takes the whole handful back. */
function boardSelItems() {
  const out = [];
  for (const id of BOARD_SEL.ids) {
    const it = BOARD_ITEMS.get(boardKey(BOARD_SEL.kind, id));
    if (it) out.push(it);
  }
  return out;
}
