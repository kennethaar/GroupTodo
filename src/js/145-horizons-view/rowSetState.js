/* Any change of state from a row. Waiting leaves Next, so there the row stays
   and counts down first; waiting with no type asks who on, and a hold
   asks until when. */
function rowSetState(a, apply, ask = true) {
  const was = a.state, id = a.block.id;
  // Set before the change, which may draw the list straight away.
  if (state.view === "next") LINGER.set(id, {until: Date.now() + LINGER_MS, was});
  inSpace(a.space, apply);
  if (a.block.state !== "WAIT" || was === "WAIT") LINGER.delete(id);
  else armLinger();
  render();
  if (ask && a.block.state === "WAIT" && was !== "WAIT" && !stageLabel(a.block)) askWaitingOn(a);
  if (ask && a.block.state === "HOLD" && was !== "HOLD" && !stageLabel(a.block)) askHoldUntil(a);
}
