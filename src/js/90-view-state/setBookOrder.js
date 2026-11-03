/* Moves a book to place i in the series, and numbers them all. */
function setBookOrder(path, i) {
  const list = bookPaths().filter(p => p !== path);
  list.splice(Math.max(0, Math.min(i, list.length)), 0, path);
  list.forEach((p, n) => { if (String(getPage(p).props.order || "") !== String(n + 1)) { getPage(p).props.order = String(n + 1); touch(p); } });
  clearMemo();
  render();
}
