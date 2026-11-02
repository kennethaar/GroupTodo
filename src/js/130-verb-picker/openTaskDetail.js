/* The task panel is read and written in the space the task lives in, whichever
   space is in front, and it remembers that task as the thing Alt-S would move. */
function openTaskDetail(path, block, space, pane) {
  const home = space || V.space;
  SPACE_CONTEXT = {path, space: home, id: block.id};
  inSpace(home, () => showTaskDetail(path, block, home));
  arrangeTaskDetail(path, block, home, pane);
}
