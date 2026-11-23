/* Use a line's picture on the slide (#476): the ![](…) with this source (or
   its first picture that Present can show) leaves the line's words and goes
   first in its notepad, where Present takes it as the slide's picture
   (slideNotes). One Ctrl+Z puts it back. False when there is none to move. */
function slidePicMove(path, b, src = "") {
  const page = getPage(path);
  const re = new RegExp(DECK_IMAGE_RE.source, "g");
  const mark = (String(b.title || "").match(re) || []).find(m => src ? DECK_IMAGE_RE.exec(m)[1] === src : slidePicture(m));
  if (!page || !mark) return false;
  const snapshot = structuredClone(page), space = V.space;
  b.title = trim(b.title.replace(mark, "").replace(/ {2,}/g, " "));
  b.body = [mark, ...(b.body || [])];
  pushUndo({run: () => {
    if (V.space !== space || !getPage(path)) return false;
    Object.assign(getPage(path), structuredClone(snapshot));
    touch(path); render();
    return true;
  }});
  touch(path); render();
  return true;
}
