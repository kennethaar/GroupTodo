/* A Slide layout pick (#433) on some lines of one page: every line gets the
   layout's mark in place of the one it had (Steps numbers them in order);
   the layout already there again, or Auto, takes the marks off. One Ctrl+Z
   takes the whole pick back, then runs back() if given. */
function slideLayoutPick(path, lines, lay, back) {
  const page = getPage(path);
  if (!page || !lines.length) return;
  const now = slideMarkOf(lines);
  const want = lay === "auto" || lay === now || (lay === "split" && now === "quadrant") ? null : lay;
  const snapshot = structuredClone(page), space = V.space;
  lines.forEach((k, i) => { k.title = slideMarkSet(k.title, want, i); });
  pushUndo({run: () => {
    if (V.space !== space || !getPage(path)) return false;
    Object.assign(getPage(path), structuredClone(snapshot));
    touch(path); render(); if (back) back();
    return true;
  }});
  touch(path); noteTodoTouched(); render();
}
