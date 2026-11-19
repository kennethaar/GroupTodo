/* Show or hide one area (#436: the bar's chips and the area menu's ticks).
   At least one stays on; hiding the one new things land in hands that job
   to one still showing. False when the change was refused. */
async function showArea(name, on) {
  const next = new Set(visibleSpaces());
  if (on) next.add(name);
  else if (next.size === 1) { notify("At least one area has to stay on."); return false; }
  else next.delete(name);
  setVisibleSpaces(Array.from(next));
  await ensureVisibleLoaded();
  if (!next.has(Spaces.active)) await openSpace(Array.from(next)[0]);
  render();
  return true;
}
