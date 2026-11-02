/* ---------- the travelling ring ----------
   A selection that teleports makes you find it again on every press. One ring
   that slides from node to node is cheap and tells you where you came from, so
   the arrows read as movement through a place rather than as a cursor jumping
   about. The first placement does not slide, because sliding in from a corner
   you were never at is a lie about where you were. */
function aroundRing(grid) {
  let ring = grid.querySelector(".aring");
  if (!ring) { ring = el("div", {class: "aring"}); grid.append(ring); }
  return ring;
}
