/* A macro written into a line from the slash menu: the line itself when it
   is empty, else a new line under it, so nothing already written is lost. */
function putMacroLine(path, b, text) {
  const page = getPage(path);
  if (!page) return;
  if (!trim(b.title) && !b.state) b.title = text;
  else {
    const sibs = siblingsOf(page, b);
    const nb = newBlock({title: text}, false);
    sibs.splice(sibs.indexOf(b) + 1, 0, nb);
    b = nb;
  }
  touch(path); render(); focusBlock(b.id, true);
}
