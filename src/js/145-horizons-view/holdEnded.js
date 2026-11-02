/* The latest hold over this task that has ended, on its lines or its project. */
function holdEnded(a) {
  let last = null;
  const take = v => { const d = holdValue(v); if (d && d !== HOLD_OPEN && d <= todayISO() && (!last || d > last)) last = d; };
  for (let p = a.block; p; p = p._parent) take(blockProp(p, "hold"));
  if (a.projectPath) inSpace(a.space, () => take(getPage(a.projectPath)?.props?.hold));
  return last;
}
