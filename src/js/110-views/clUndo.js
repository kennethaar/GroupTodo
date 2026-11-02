function clUndo() {
  const u = CL.undo;
  if (!u || !V.pages.has(u.path)) return;
  Object.assign(getPage(u.path), structuredClone(u.snap));
  touch(u.path);
  clSetDealt(u.dealt);
  CL.undo = CL.pending = null;
  render();
  notify("Put the last line back.");
}
