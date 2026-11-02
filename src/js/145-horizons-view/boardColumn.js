/* The shell every column shares: the head, the drop target, and the rule about
   what it will take. A task card dropped on a status column is a no-op rather
   than a surprise, and so is the part of a mixed handful that is already where
   it is being dropped -- the rest still moves. */
function boardColumn(head, accepts, onDrop) {
  return boardDropTarget(el("div", {class: "bcol"}, head), accepts, onDrop);
}
