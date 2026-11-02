/* With one thing in the toast its buttons go in the top row; with more, each
   keeps its own beside its name, so it is clear which one they act on. */
function placeDoneActs() {
  const T = DONE_TOAST, items = [...T.list.children];
  for (const it of items) (items.length === 1 ? T.slot : it._row).append(it._acts);
}
