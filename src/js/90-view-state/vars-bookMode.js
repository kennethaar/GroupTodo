/* Outline or Prose, per device. */
const bookMode = () => PREF.get("book.mode", "outline") === "prose" ? "prose" : "outline";
const isChapterPage = path => hasBook() && !!bookOfChapter(path);
/* Words written today in a book: the total now, less the total the first
   time the book was looked at today. Kept per device. */
const bookTotal = (book = bookPath()) => chaptersOf(book).reduce((n, c) => n + (c.path ? chapterWords(c.path) : 0), 0);
