function runListUnder(path, b, listPath) {
  const page = getPage(path);
  if (!page) return;
  const snapshot = structuredClone(page), space = V.space;
  const from = page.blocks.length;
  const got = applyStencil(listPath, path);
  // applyStencil puts them at the end of the page; they belong here.
  const added = page.blocks.splice(from);
  if (!added.length) { notify(pageTitle(listPath) + " has no steps to add."); render(); return; }
  const sibs = siblingsOf(page, b), i = sibs.indexOf(b);
  if (i < 0) page.blocks.push(...added);
  // An empty line is nothing written, even when Enter after a task made it a TODO.
  else if (!trim(b.title) && !(b.children || []).length) sibs.splice(i, 1, ...added);
  else sibs.splice(i + 1, 0, ...added);
  const back = () => {
    if (V.space !== space || !getPage(path)) return false;
    Object.assign(getPage(path), structuredClone(snapshot));
    touch(path); render();
    return true;
  };
  pushUndo({run: back});
  touch(path); noteTodoTouched(); render(); focusBlock(added[0].id, true);
  // The caret is in a line now, where ctrl-z is the line's own, so the toast offers it.
  const todos = stencilMakesTodos(listPath);
  notify(got.lines + " " + (todos ? "step" : "line") + (got.lines === 1 ? "" : "s") + " from " + pageTitle(listPath) + " added.",
    "info", {label: "undo", run: back});
}
