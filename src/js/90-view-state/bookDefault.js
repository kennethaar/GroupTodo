/* The book shown goes; its chapters stay pages, and the others stay books. */
function bookDefault() {
  const path = bookPath(), name = bookName(path);
  if (!getPage(path)) return;
  removePage(path);
  clearMemo();
  render();
  notify(hasBook() ? name + " is gone. Its chapters are still pages." : "The book is gone from this area. Its chapters are still pages.");
}
