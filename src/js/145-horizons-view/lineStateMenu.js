function lineStateMenu(path, b, space, canUntask) {
  const a = {path, block: b, state: b.state, title: b.title, space};
  const untask = canUntask && b.state ? [["n", "Not a task", null, () => { inSpace(space, () => setBlockState(path, b, null)); render(); }]] : [];
  const cols = stateColumns(a, untask);
  if (cols) columnMenu(plainTitle(b.title), "state", cols);
  else chipMenu(plainTitle(b.title), "state", [...stateRows(a), ...untask]);
}
