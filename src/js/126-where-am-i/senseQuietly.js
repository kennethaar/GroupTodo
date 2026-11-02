async function senseQuietly() {
  if (!senseOn() || !V.loaded || Date.now() - SENSE_AT < 15 * 60000) return;
  SENSE_AT = Date.now();
  const g = await senseGuess(false);
  if (!g || g.ctx === state.context) return;
  const ctx = makeContext(g.ctx);
  const a = document.activeElement;
  const writing = a && (a.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName));
  if (senseAuto() && !writing && !$("#modalRoot").firstChild) {
    state.context = ctx;
    state.surfaced = oldestTodosForContext(ctx).map(x => x.block.id);
    setSetting("current_context", ctx);
    renderContextChip();
    render();
    notify("Now @" + ctx + " (" + g.why + ").", "info",
      {label: "Change", run: () => openContextPicker("Where are you now?", surfaceContext)});
    return;
  }
  const mark = ctx + "|" + todayISO() + "T" + new Date().getHours();
  if (PREF.get("sense.offered", "") === mark) return;
  PREF.set("sense.offered", mark);
  notify("You seem to be at @" + ctx + " (" + g.why + ").", "info",
    {label: "Switch", run: () => surfaceContext(ctx, g.why)});
}
