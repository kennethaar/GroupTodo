/* The blocks you can actually see, in the order you see them. Collapsed
   children are not rendered at all, so the DOM is already the right answer. */
function moveToBlock(txt, dir) {
  const outline = txt.closest(".outline");
  if (!outline) return false;
  const all = $$(".txt", outline);
  const next = all[all.indexOf(txt) + dir];
  if (!next) return false;
  const id = next.closest(".blk")?.dataset.id;
  if (!id) return false;
  txt.blur();
  // Up lands at the end of the block above and Down at the start of the one
  // below, so holding the key walks through a wrapped line rather than
  // skipping over it.
  focusBlock(id, dir < 0);
  return true;
}
