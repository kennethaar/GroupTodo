/* Read every captured line that is a task, and offer to take it all back in
   one toast: a guess about one line is not worth a dialog per line. */
function readWhenInto(blocks) {
  const undo = [];
  walkBlocks(blocks, b => {
    if (!b.state) return;
    const w = parseWhen(b.title);
    if (!w) return;
    undo.push({block: b, w, keys: applyWhen(b, w)});
  });
  return undo;
}
