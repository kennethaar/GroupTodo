/* The week's day pages, the active projects, people, contexts and
   organisations are in: the screen shows them without waiting for the rest. */
function soonLoaded(rec) {
  if (LOADED.get(rec.name) !== rec) return;
  if (V.space === rec.name) bindActive(rec.name);
  clearMemo();
  renderUnlessTyping();
}
