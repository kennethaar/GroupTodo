/* "Keep as text" on the toast after a table was pasted (#469): the table
   goes and the text comes in its place as lines, as a paste did before. */
function tableKeepText(path, t, raw, state) {
  const page = getPage(path);
  const sibs = page && siblingsOf(page, t);
  if (!sibs || !sibs.includes(t)) return;
  const roots = parseOutlineText(raw);
  if (!roots.length) return;
  readyPastedBlocks(roots, {defaultState: state});
  sibs.splice(sibs.indexOf(t), 1, ...roots);
  touch(path); noteTodoTouched(); render();
  focusBlock(roots[roots.length - 1].id);
}
