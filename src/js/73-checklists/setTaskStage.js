/* A stage carries its state with it. */
function setTaskStage(path, block, list, name) {
  const s = stagesOf(list).find(x => x.name === name);
  setBlockState(path, block, s ? s.core : block.state || "TODO", {stage: {list, name: s ? s.name : ""}});
}
