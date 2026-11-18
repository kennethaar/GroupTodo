/* A Slide layout pick (#433): every line it marks gets the layout's mark in
   place of the one it had; the layout already there again, or Auto, takes
   the marks off. One Ctrl+Z takes the whole pick back. The caret stays in
   the line it was in. */
function editBarSlideLayout(lay) {
  if (!FLY) return;
  const {txt, path, block: b} = FLY;
  const top = txt.getBoundingClientRect().top;
  txt.blur();                        // the words typed so far are kept first
  const page = getPage(path);
  if (!page) return;
  const lines = editBarSlideLines(b);
  const now = slideMarkOf(lines);
  const want = lay === "auto" || lay === now || (lay === "split" && now === "quadrant") ? null : lay;
  const snapshot = structuredClone(page), space = V.space;
  lines.forEach((k, i) => { k.title = slideMarkSet(k.title, want, i); });
  pushUndo({run: () => {
    if (V.space !== space || !getPage(path)) return false;
    Object.assign(getPage(path), structuredClone(snapshot));
    touch(path); render(); focusBlock(b.id);
    return true;
  }});
  touch(path); noteTodoTouched(); render();
  editBarRefocus(b.id, top);
}
