/* A task added straight to a project shows on today's Journal as a live
   reference (#430): the line there is {{embed ((id))}}, so ticking it ticks
   the task in the project file. The task stays where it was written, and a
   day page gets the reference once. */
function referInJournal(path, b) {
  if (!b || !b.state || !OPEN_STATES[b.state] || pageKind(path) !== "project") return;
  const id = ensureBlockId(path, b);
  const day = ensureJournal(todayISO()), page = getPage(day);
  const line = "{{embed ((" + id + "))}}";
  const has = list => (list || []).some(x => (x.title || "").includes(line) || has(x.children));
  if (has(page.blocks)) return;
  page.blocks.push(newBlock({title: line}, false));
  flattenBlocks(page.blocks);
  touch(day);
}
