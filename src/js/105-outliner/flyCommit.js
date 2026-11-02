/* The words typed so far are the line's before anything is set on it. */
function flyCommit() {
  const {txt, path, block} = FLY;
  const val = lineText(txt);
  if (val === block.title) return;
  const [st, rest] = splitState(val);
  if (st) { const prev = block.state; block.state = st; block.title = rest; if (!prev) applyTodoTemplate(block); }
  else block.title = val;
  touch(path);
}
