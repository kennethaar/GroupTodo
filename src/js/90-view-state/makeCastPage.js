/* A page of their own. A character is a person, made the way a link to
   [[p/Name]] makes one; a place or a thing comes from its template in 8/,
   or as a bare page saying what it is when the template is gone. */
function makeCastPage(name, type = "character") {
  name = oneLine(name);
  if (!name) return null;
  if (type === "character") {
    createLinkedPages("[[p/" + name + "]]");
    clearMemo();
    return V.pages.has(personPath(name)) ? personPath(name) : null;
  }
  let path = findExistingPage(name);
  if (!path) {
    path = resolveWikiPath(name);
    putPage(path, readTemplate(type) ? pageFromTemplate(type, name) : {props: {title: name, type}, blocks: []});
  }
  clearMemo();
  return path;
}
