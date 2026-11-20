/* Alt+T and Alt+N on picked lines (#411): every one becomes a task, or a
   note, as one line does. A line that already is one stays as it is. One
   ctrl-z takes the whole press back. */
function lineSelKind(task) {
  const got = lineSelBlocks();
  if (!got) return;
  const path = LINE_SEL.path, snapshot = structuredClone(got.page), space = V.space;
  const todo = got.blocks.filter(b => task ? !b.state : b.state);
  if (todo.length) {
    const before = UNDO.slice();
    for (const b of todo) setBlockState(path, b, task ? "TODO" : null);
    // Each step above kept its own undo; the press is one thing to take back.
    UNDO.splice(0, UNDO.length, ...UNDO.filter(u => before.includes(u)));
    pushUndo({run: () => {
      if (V.space !== space || !getPage(path)) return false;
      Object.assign(getPage(path), structuredClone(snapshot));
      touch(path); render();
      return true;
    }});
    touch(path); noteTodoTouched(); render(); paintLineSel();
  }
  const n = got.blocks.length;
  notify(task ? (n === 1 ? "A task now." : n + " lines are tasks now.")
    : n === 1 ? "A note now." : n + " lines are notes now.");
}
