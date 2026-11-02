/* Ctrl+Enter walks the stages, and round again; the state badge picks one from its menu. */
function nextStage(path, block) {
  const t = taskStage(block);
  if (!t || !t.stages.length) return false;
  const i = t.stage ? t.stages.indexOf(t.stage) : -1;
  setTaskStage(path, block, t.list, t.stages[(i + 1) % t.stages.length].name);
  return true;
}
