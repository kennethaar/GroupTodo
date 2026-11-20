/* Backspace on the sorting card: the last answer is taken back. */
function actSortUndo(r) {
  const S = ACT_SORT, last = S && S.past.pop();
  if (!last) return false;
  inS(r, () => { putPage(r.path, clonePage(last.page)); touch(r.path); });
  S.asked = last.asked;
  clearMemo();
  render();
  return true;
}
