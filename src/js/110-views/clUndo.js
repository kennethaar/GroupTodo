/* Takes the newest answer back: its page as it was, and the line dealt again.
   Again and again, one answer at a time (#365). */
function clUndo() {
  const u = CL.undos.pop();
  CL.pending = null;
  if (!u || !V.pages.has(u.path)) { render(); return; }
  Object.assign(getPage(u.path), structuredClone(u.snap));
  touch(u.path);
  clSetDealt(u.dealt);
  render();
  notify("Put \u201C" + u.title + "\u201D back.");
}
