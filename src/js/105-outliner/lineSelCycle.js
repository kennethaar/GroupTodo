/* Ctrl+Enter on picked lines: the same cycle as on one line, and they all go
   round together. The first line takes its next step and the rest follow it
   to where it landed, so a mixed handful comes out of one press all alike.
   One ctrl-z takes the whole press back. */
function lineSelCycle() {
  const got = lineSelBlocks();
  if (!got) return;
  const path = LINE_SEL.path, snapshot = structuredClone(got.page), space = V.space;
  const before = UNDO.slice();
  const [first, ...rest] = got.blocks;
  cycleState(path, first);
  for (const b of rest) if ((b.state ?? null) !== (first.state ?? null)) setBlockState(path, b, first.state ?? null);
  // Each step above kept its own undo; the press is one thing to take back.
  UNDO.splice(0, UNDO.length, ...UNDO.filter(u => before.includes(u)));
  pushUndo({run: () => {
    if (V.space !== space || !getPage(path)) return false;
    Object.assign(getPage(path), structuredClone(snapshot));
    touch(path); render();
    return true;
  }});
  touch(path); noteTodoTouched(); render(); paintLineSel();
  const n = got.blocks.length;
  notify(first.state ? (n === 1 ? "Now " : n + " lines now ") + first.state + "."
    : n === 1 ? "No longer a task." : n + " lines are no longer tasks.");
}
