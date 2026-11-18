/* One thing → lights on a drawn slide (#433), faint until it comes. It
   carries its line's id, so a line's own slide can grow out of it. */
function slidePart(b, cls, ...kids) {
  return el("div", {class: "part later " + cls, "data-bid": b.id}, ...kids);
}
