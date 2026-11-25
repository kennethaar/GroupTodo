/* The element on the slide a pointer is on that Alt+drag can move (#487):
   {node, kind, id}. A line's own element, the title, or the picture shown. */
function slideArrOf(target) {
  const cur = DECK?.deck.querySelector(".slide.cur");
  if (!cur || !target || !cur.contains(target)) return null;
  // A picture pin's label is placed apart from its picture (#488).
  const label = target.closest(".mlabel");
  if (label && cur.contains(label)) return {node: label, kind: "label", id: label.dataset.lbid};
  const line = target.closest("[data-bid]");
  if (line && cur.contains(line)) return {node: line, kind: "line", id: line.dataset.bid};
  const title = target.closest(".stitle");
  if (title) return {node: title, kind: "title", id: ""};
  /* The picture's shade lies over it (.cover::after), so a press there is on
     .cover itself: the picture shown is the one meant. */
  const cover = target.closest(".cover");
  const pic = target.closest(".cover .pic") || cover?.querySelector(".pic.on") || cover?.querySelector(".pic");
  if (pic && pic.querySelector("img")) return {node: pic.querySelector("img"), kind: "pic", id: pic.dataset.pic};
  return null;
}
