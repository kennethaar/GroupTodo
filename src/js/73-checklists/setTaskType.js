/* Giving a task a type starts it at the first stage that fits where it is. */
function setTaskType(path, block, list) {
  if (!list) { writeStage(block, null); touch(path); render(); return; }
  const stages = stagesOf(list);
  const s = stages.find(x => x.core === block.state) || stages[0];
  setTaskStage(path, block, list, s ? s.name : "");
}
