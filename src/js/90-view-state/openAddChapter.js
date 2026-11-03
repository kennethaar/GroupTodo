/* Pages that could be a chapter: plain pages and notes in no book yet. */
function openAddChapter() {
  const inBook = new Set(seriesChapters().map(c => c.path).filter(Boolean));
  const pages = allPages(p => !isBookPath(p) && !inBook.has(p) && (pageKind(p) === "page" || pageKind(p) === "zettel"));
  const NEW = {isNew: true, label: "+ New page"};
  listPicker({title: "Add a chapter", items: [NEW, ...pages], typeahead: true,
    label: p => p === NEW ? NEW.label : pageTitle(p), detail: p => p === NEW ? "a chapter of its own" : pageRef(p),
    onPick: p => p === NEW ? newChapterPrompt() : addBookChapter(pageRef(p))});
}
