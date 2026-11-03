/* Out of the book. The page itself stays. */
function dropBookChapter(i) {
  const page = bookPage();
  page.blocks.splice(page.blocks.indexOf(bookChapters()[i].block), 1);
  saveBook();
}
