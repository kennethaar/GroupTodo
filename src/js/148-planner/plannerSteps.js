/* Every step, open or closed: its own lines and day-page lines naming it.
   Copies, so the urgency cached on them stays out of the shared rows. */
function plannerSteps(r) {
  const title = pageTitle(r.path);
  const rows = [];
  const page = getPage(r.path);
  if (page) for (const b of flattenBlocks(page.blocks))
    if (b.state && !isMessage(b) && !hasOpenDescendant(b)) rows.push({path: r.path, block: b});
  for (const row of journalActionsFor(r.path))
    if (!rows.some(x => x.block === row.block)) rows.push({path: row.path, block: row.block, added: row.added});
  return rows.map(x => ({...x, state: x.block.state, title: x.block.title, context: blockContext(x.block),
    project: title, projectPath: r.path, space: r.space, mine: true}));
}
