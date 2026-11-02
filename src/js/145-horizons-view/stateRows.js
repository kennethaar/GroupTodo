/* Every state the task can be in, or its type's stages, the one it is in marked. */
function stateRows(a) {
  const t = inSpace(a.space, () => taskStage(a.block));
  if (t && t.stages.length) return t.stages.slice(0, 9).map((st, i) => [String(i + 1), st.name,
    st === t.stage ? "now" : CORE_WORD[st.core], () => rowSetState(a, () => setTaskStage(a.path, a.block, t.list, st.name), false)]);
  return [["t", "To do", "TODO"], ["d", "Doing", "DOING"], ["w", "Waiting for\u2026", "WAIT"], ["x", "Done", "DONE"], ["c", "Cancelled", "CANCELLED"]]
    .map(([k, label, st]) => [k, label, a.state === st ? "now" : null,
      () => a.state === st ? null : rowSetState(a, () => setBlockState(a.path, a.block, st))]);
}
