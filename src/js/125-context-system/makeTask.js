function makeTask(path, block) {
  if (projectLineToTask(path, block)) return;
  if (block.state) {
    notify("Already a task. ctrl-enter walks it through TODO, DOING, WAIT, DONE.");
    return;
  }
  setBlockState(path, block, "TODO");
  noteTodoTouched();
  coachMark("add");
  notify("TODO. ctrl-enter again for DOING, WAIT, DONE.");
}
