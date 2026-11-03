/* The book a chapter is in: the one shown if it is in that, or else the first it is in. */
function bookOfChapter(path) {
  const cur = bookPath();
  if (chaptersOf(cur).some(c => c.path === path)) return cur;
  return bookPaths().find(b => chaptersOf(b).some(c => c.path === path)) || null;
}
