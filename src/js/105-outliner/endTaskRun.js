/* An empty task line made plain by Enter (#511). What the todo template and
   the Added stamp put on it goes too: an empty plain line has nothing to keep.
   One undo brings the task back. */
function endTaskRun(path, b) {
  const snapshot = structuredClone(getPage(path)), space = V.space;
  pushUndo({
    run: () => {
      if (V.space !== space || !getPage(path)) return false;
      Object.assign(getPage(path), structuredClone(snapshot));
      touch(path);
      render();
      return true;
    },
  });
  b.state = null;
  b.props = {};
  TEMPLATE_APPLIED.delete(b);
  touch(path);
  render();
  focusBlock(b.id);
}
