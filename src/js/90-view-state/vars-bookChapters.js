const bookChapters = () => chaptersOf(bookPath());
/* Every book's chapters, the books in series order. */
const seriesChapters = () => bookPaths().flatMap(chaptersOf);
/* What Cast, Timeline and Plot look at: the book shown, or every book in the
   area. Only a choice with more than one book. */
const bookScope = () => bookPaths().length > 1 && PREF.get("book.scope", "book") === "all" ? "all" : "book";
