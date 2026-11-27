/* A Slide layout pick (#433) on some lines of one page. Lines that are all
   of one line's lines: that line gets the layout word, and their old marks
   come off (#481). Others (top lines, or some of a line's lines) each get
   the layout's mark in place of the one they had (Steps numbers them in
   order). The layout already there again, or Auto, takes it off. One
   Ctrl+Z takes the whole pick back, then runs back() if given. */
function slideLayoutPick(path, lines, lay, back) {
  const page = getPage(path);
  if (!page || !lines.length) return;
  const owner = slideOwner(path, lines), now = slideLayoutNow(path, lines);
  const want = lay === "auto" || lay === now || (lay === "split" && now === "quadrant") ? null : lay;
  // A layout word such as (map) needs the slide's own line (#488): never one per line.
  // A word, not a one-letter mark such as Cycle's (o).
  if (!owner && want && !SLIDE_MENU.some(([k, , m]) => k === want && !/^\(\p{L}{2,}\)$/u.test(m))) return;
  const snapshot = structuredClone(page), space = V.space;
  if (owner) {
    owner.title = slideWordSet(owner.title, want);
    for (const k of lines) if (slideMark(k.title).layout) k.title = slideMarkSet(k.title, null);
  } else lines.forEach((k, i) => { k.title = slideMarkSet(k.title, want, i); });
  pushUndo({run: () => {
    if (V.space !== space || !getPage(path)) return false;
    Object.assign(getPage(path), structuredClone(snapshot));
    touch(path); render(); if (back) back();
    return true;
  }});
  touch(path); noteTodoTouched(); render();
}
