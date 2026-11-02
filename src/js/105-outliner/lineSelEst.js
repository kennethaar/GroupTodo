function lineSelEst() {
  const got = lineSelBlocks();
  const tasks = got ? got.blocks.filter(b => b.state) : [];
  if (!tasks.length) { notify("Only a task takes time. Make the line a task first."); return; }
  const now = Date.now(), ids = LINE_SEL.ids.join();
  EST_KEYS.n = now - EST_KEYS.at < 900 && EST_KEYS.ids === ids ? (EST_KEYS.n + 1) % 4 : 1;
  EST_KEYS.at = now; EST_KEYS.ids = ids;
  const n = EST_KEYS.n;
  for (const b of tasks) b.title = withEst(b.title, n);
  touch(LINE_SEL.path); noteTodoTouched(); render(); paintLineSel();
  const who = tasks.length === 1 ? "It takes " : tasks.length + " tasks take ";
  notify(n ? who + EST_LABEL[n] + " (" + EST_MARK[n] + ")." : "Time taken off.");
}
