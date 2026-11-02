/* Something other than the stage moved the state -- the tick, the pause
   button, a key: the stage follows to the first one counting as that state.
   A type with no stage of that kind takes an open state as "not finished"
   and goes back to its first open stage: an unticked purchase is Ordered
   again, not a to do the type has no word for. */
function syncStage(block) {
  const t = taskStage(block);
  if (!t || (t.stage && t.stage.core === block.state)) return;
  let s = t.stages.find(x => x.core === block.state);
  if (!s && OPEN_STATES[block.state]) s = t.stages.find(x => OPEN_STATES[x.core]);
  if (s) block.state = s.core;
  writeStage(block, t.list, s ? s.name : "");
}
