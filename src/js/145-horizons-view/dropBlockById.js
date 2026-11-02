/* A line taken out by its id, wherever it is written. */
function dropBlockById(id) {
  const f = findBlock(id);
  if (!f) return;
  const sibs = siblingsOf(f.page, f.block), at = sibs.indexOf(f.block);
  if (at >= 0) sibs.splice(at, 1);
  touch(f.path);
}
