/* The day on this line, or on the nearest line above that has one. */
function inheritedDay(block, key) {
  for (let p = block; p; p = p._parent) {
    const day = dateIn(blockProp(p, key));
    if (day) return {day, own: p === block};
  }
  return null;
}
