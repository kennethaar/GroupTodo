/* Writing in a chapter of another book makes that the book shown, so its
   style and goals are the ones in use. Asked while the page is drawn, so the
   memos keyed on the book are simply asked again. */
function followChapter(path) {
  const book = bookOfChapter(path);
  if (book && book !== bookPath()) setCurrentBook(book, {quiet: true});
}
