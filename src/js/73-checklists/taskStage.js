/* {list, stage} for a task with a type, else null. */
function taskStage(block) {
  const m = /\[\[(8\/[^\]]+)\]\]\s*(.*)$/.exec(trim(blockProp(block, "stage") || ""));
  if (!m) return null;
  const list = findExistingPage(m[1]);
  if (!list || !isStateList(list)) return null;
  const stages = stagesOf(list);
  const stage = stages.find(s => s.name.toLowerCase() === trim(m[2]).toLowerCase()) || null;
  return {list, stages, stage};
}
