/* A chapter at the end, as a link; a new page is made for a name not taken. */
function addBookChapter(name, {make = false} = {}) {
  name = trim(name || "");
  if (!name) return;
  let path = findExistingPage(name);
  if (!path && make) { path = resolveWikiPath(name); putPage(path, pageTemplateFor("page", name)); }
  if (bookChapters().some(c => c.name.toLowerCase() === name.toLowerCase() || (path && c.path === path))) return;
  bookPage().blocks.push(newBlock({title: "[[" + (path ? pageRef(path) : name) + "]]"}, false));
  saveBook();
}
