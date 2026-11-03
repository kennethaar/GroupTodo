/* Ctrl+Enter in the outliner. The cycle comes back round to "not a task at
   all", so anything made a todo by accident -- or a line that stopped being
   one -- can be turned back into an ordinary note without retyping it. */
function cycleState(path, block) {
  if (block.state && nextStage(path, block)) return;
  if (projectLineToTask(path, block)) return;
  const order = ["TODO", "DOING", "WAIT", "DONE", "CANCELLED", null];
  const i = order.indexOf(block.state ?? null);
  setBlockState(path, block, order[(i + 1) % order.length]);
}
