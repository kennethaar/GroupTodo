// why: what a sensed context was guessed from, said with a way to change it.
function surfaceContext(ctx, why = "") {
  if (!why && ctx) senseLearn("ctx", ctx);      // picked by you, not guessed
  state.context = ctx;
  state.lastTodoTouch = Date.now();
  const items = oldestTodosForContext(ctx);
  state.surfaced = items.map(a => a.block.id);
  setSetting("current_context", ctx);
  renderContextChip();
  PREF.set("today.tab", "ctx");
  go("today");
  const said = items.length
    ? `@${ctx}: ${items.length} oldest action(s) surfaced.`
    : `@${ctx}: nothing open here. Capture one?`;
  if (!why) { notify(said); return; }
  notify(said + " (" + why + ")", "info",
    {label: "Change", run: () => openContextPicker("Where are you now?", surfaceContext)});
}
