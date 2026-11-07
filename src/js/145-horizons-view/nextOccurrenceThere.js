/* The next round already put in: an open copy of the same job, due on that
   day, on the page it would go on. Done, Doing, Done again is one finish
   logged in two stretches, not two, so it gets no second copy (#313). */
function nextOccurrenceThere(path, block, when) {
  const ref = choreNextRef(block, when);
  const home = ref ? journalPath(ref) : path;
  const page = getPage(home);
  if (!page) return null;
  const key = choreKey(block.title);
  return flattenBlocks(page.blocks).find(b => b !== block && OPEN_STATES[b.state] &&
    choreKey(b.title) === key && dueDate(b) === when) || null;
}
