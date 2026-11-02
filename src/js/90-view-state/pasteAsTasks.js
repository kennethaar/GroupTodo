/* A list pasted into a one-line box is still a list: one task per line. */
function pasteAsTasks(raw) {
  const roots = parseOutlineText(raw);
  if (!roots.length) return null;
  const path = ensureJournal(todayISO());
  const n = readyPastedBlocks(roots, {defaultState: "TODO", context: state.context, outlineRoots: true, when: true});
  for (const blk of roots) getPage(path).blocks.push(blk);
  touch(path); noteTodoTouched(); coachMark("add"); render();
  return {path, roots, n};
}
