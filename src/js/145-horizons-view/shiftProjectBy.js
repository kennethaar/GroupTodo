/* Everything open and dated in the project moves together, so the shape of the
   plan inside it survives the move. Closed tasks stay where they happened. */
function shiftProjectBy(path, days) {
  if (!days) return 0;
  const page = getPage(path);
  if (!page) return 0;
  let n = 0;
  walkBlocks(page.blocks, b => {
    if (!b.state || isMessage(b) || !canMoveTask(b)) return;
    if (shiftTaskBy(path, b, days)) n++;
  });
  if (n) touch(path);
  return n;
}
