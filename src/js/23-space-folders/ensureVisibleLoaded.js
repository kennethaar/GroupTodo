/* Reads in the areas shown beside the open one. Opening an area does not wait
   for it: today's journal is drawn first, and the others join the screen as
   they come in. Awaited, it settles once they are all in (#387). */
function ensureVisibleLoaded() {
  const pending = visibleSpaces().filter(n => !LOADED.has(n)).map(n => {
    if (!VISIBLE_READING.has(n))
      VISIBLE_READING.set(n, loadSpaceRecord(n).catch(() => null).finally(() => VISIBLE_READING.delete(n)));
    return VISIBLE_READING.get(n);
  });
  if (!pending.length) return Promise.resolve(false);
  return Promise.all(pending).then(() => {
    scanVerbs(); clearMemo();
    renderUnlessTyping();
    return true;
  });
}
