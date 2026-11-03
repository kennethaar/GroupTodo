/* Shows a book, in its own area. */
function showBook(b) {
  if (b.area === V.space) { setCurrentBook(b.path); return; }
  openSpace(b.area, {view: "book"}).then(() => { if (bookPaths().includes(b.path)) setCurrentBook(b.path); });
}
