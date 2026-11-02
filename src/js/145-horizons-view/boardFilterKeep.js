/* Does this card survive the filters that are on? A card is dropped when the
   side it falls on -- yes or no -- has been switched off. */
function boardFilterKeep(mode, x) {
  const hidden = boardHidden(mode);
  if (!hidden.size) return true;
  return (BOARD_FILTERS[mode] || [])
    .every(f => !hidden.has(f.key + (f.test(x) ? ":yes" : ":no")));
}
