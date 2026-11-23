/* ☰ › Tidy slide marks (#481), only when asked: each slide's old marks
   on its lines become one layout word on the line above them. The slides
   are drawn as before. One Ctrl+Z takes it all back. */
function slideTidy(path) {
  const page = getPage(path), todo = slideTidyLines(path);
  if (!page || !todo.length) return;
  const snapshot = structuredClone(page), space = V.space;
  for (const [b, lay] of todo) {
    b.title = slideWordSet(b.title, lay);
    for (const k of b.children) if (slideMark(k.title).layout) k.title = slideMarkSet(k.title, null);
  }
  pushUndo({run: () => {
    if (V.space !== space || !getPage(path)) return false;
    Object.assign(getPage(path), structuredClone(snapshot));
    touch(path); render();
    return true;
  }});
  touch(path); noteTodoTouched(); render();
  notify(`Tidied ${todo.length} slide${todo.length === 1 ? "" : "s"}: the layout word is on each slide's line.`);
}
