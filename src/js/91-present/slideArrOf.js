/* The element on the slide a pointer is on that Alt+drag can move (#487):
   {node, kind, id}. A line's own element, the title, or the picture shown. */
function slideArrOf(target) {
  const cur = DECK?.deck.querySelector(".slide.cur");
  if (!cur || !target || !cur.contains(target)) return null;
  const line = target.closest("[data-bid]");
  if (line && cur.contains(line)) return {node: line, kind: "line", id: line.dataset.bid};
  const title = target.closest(".stitle");
  if (title) return {node: title, kind: "title", id: ""};
  const pic = target.closest(".cover .pic");
  if (pic && pic.querySelector("img")) return {node: pic.querySelector("img"), kind: "pic", id: pic.dataset.pic};
  return null;
}
